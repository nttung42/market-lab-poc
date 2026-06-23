import { useState, useEffect } from 'react';
import { ProjectOverview } from './pages/ProjectOverview';
import { PersonaCatalog } from './pages/PersonaCatalog';
import { RespondentsDashboard } from './pages/RespondentsDashboard';
import { StudyBuilder } from './pages/StudyBuilder';
import { ResultsDashboard } from './pages/ResultsDashboard';
import { ReportExport } from './pages/ReportExport';
import { getProjects } from './api/client';
import type { Project } from './types';
import { Layout, Users, ExternalLink, Sparkles, ClipboardList, BarChart3, FileText } from 'lucide-react';

type View = 'project-overview' | 'create-project' | 'edit-project' | 'persona-catalog' | 'synthetic-respondents' | 'study-builder' | 'results-dashboard' | 'report-export';


const parseHash = (hash: string) => {
  const path = hash.replace(/^#/, ''); // Remove leading "#"
  let match: RegExpMatchArray | null = null;
  
  if (!path || path === '/' || path === '/projects') {
    return { view: 'project-overview' as View, projectId: null };
  }
  
  if (path === '/create-project') {
    return { view: 'create-project' as View, projectId: null };
  }
  
  // Pattern: /projects/:projectId/edit
  match = path.match(/^\/projects\/([^\/]+)\/edit$/);
  if (match) {
    return { view: 'edit-project' as View, projectId: match[1] };
  }
  
  // Pattern: /projects/:projectId/personas
  match = path.match(/^\/projects\/([^\/]+)\/personas$/);
  if (match) {
    return { view: 'persona-catalog' as View, projectId: match[1] };
  }
  
  // Pattern: /projects/:projectId/respondents
  match = path.match(/^\/projects\/([^\/]+)\/respondents$/);
  if (match) {
    return { view: 'synthetic-respondents' as View, projectId: match[1] };
  }
  
  // Pattern: /projects/:projectId/study-builder
  match = path.match(/^\/projects\/([^\/]+)\/study-builder$/);
  if (match) {
    return { view: 'study-builder' as View, projectId: match[1] };
  }
  
  // Pattern: /projects/:projectId/results/:studyId
  match = path.match(/^\/projects\/([^\/]+)\/results\/([^\/]+)$/);
  if (match) {
    return { view: 'results-dashboard' as View, projectId: match[1], studyId: match[2] };
  }
  
  // Pattern: /projects/:projectId/reports/:studyId
  match = path.match(/^\/projects\/([^\/]+)\/reports\/([^\/]+)$/);
  if (match) {
    return { view: 'report-export' as View, projectId: match[1], studyId: match[2] };
  }
  
  // Pattern: /projects/:projectId
  match = path.match(/^\/projects\/([^\/]+)$/);
  if (match) {
    return { view: 'project-overview' as View, projectId: match[1] };
  }
  
  return { view: 'project-overview' as View, projectId: null };
};

const navigate = (path: string) => {
  window.location.hash = path;
};

function App() {
  const [currentView, setCurrentView] = useState<View>('project-overview');
  const [selectedStudyId, setSelectedStudyId] = useState<string>('study-concept-test');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeProjectName, setActiveProjectName] = useState<string>('No Active Project');

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
    const handleHashChange = () => {
      const parsed = parseHash(window.location.hash);
      setCurrentView(parsed.view);
      setActiveProjectId(parsed.projectId);
      if (parsed.studyId) {
        setSelectedStudyId(parsed.studyId);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initialize on first render
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectProject = (projectId: string | null) => {
    if (projectId) {
      navigate(`/projects/${projectId}`);
    } else {
      navigate(`/projects`);
    }
  };

  const isNavDisabled = !activeProjectId;

  return (
    <div className="min-h-screen flex flex-col bg-ml-surface text-ml-ink selection:bg-ml-blue-soft selection:text-ml-blue-strong">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-ml-border bg-white shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="font-black text-xl tracking-tight leading-none">
              <span className="text-ml-blue">MARKET</span>
              <span className="text-ml-ink">LAB</span>
            </span>
            <span className="text-[10px] font-bold text-ml-ink bg-ml-surface px-2 py-0.5 rounded tracking-wider uppercase border border-ml-border/50">
              PoC Sandbox
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => {
                if (activeProjectId) {
                  navigate(`/projects/${activeProjectId}`);
                } else {
                  navigate(`/projects`);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-colors duration-150 ${
                currentView === 'project-overview' || currentView === 'create-project' || currentView === 'edit-project'
                  ? 'bg-ml-blue text-white shadow-xs'
                  : 'text-ml-ink-muted hover:text-ml-ink hover:bg-ml-surface'
              }`}
            >
              <Layout size={13} />
              OVERVIEW
            </button>
            <button
              onClick={() => { if (!isNavDisabled) navigate(`/projects/${activeProjectId}/personas`); }}
              disabled={isNavDisabled}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-colors duration-150 ${
                currentView === 'persona-catalog'
                  ? 'bg-ml-blue text-white shadow-xs'
                  : 'text-ml-ink-muted hover:text-ml-ink hover:bg-ml-surface'
              } ${isNavDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Users size={13} />
              PERSONAS
            </button>
            <button
              onClick={() => { if (!isNavDisabled) navigate(`/projects/${activeProjectId}/respondents`); }}
              disabled={isNavDisabled}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-colors duration-150 ${
                currentView === 'synthetic-respondents'
                  ? 'bg-ml-blue text-white shadow-xs'
                  : 'text-ml-ink-muted hover:text-ml-ink hover:bg-ml-surface'
              } ${isNavDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Sparkles size={13} />
              RESPONDENTS
            </button>
            <span className="h-4 w-[1px] bg-ml-border mx-1"></span>
            <button
              onClick={() => { if (!isNavDisabled) navigate(`/projects/${activeProjectId}/study-builder`); }}
              disabled={isNavDisabled}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-colors duration-150 ${
                currentView === 'study-builder'
                  ? 'bg-ml-blue text-white shadow-xs'
                  : 'text-ml-ink-muted hover:text-ml-ink hover:bg-ml-surface'
              } ${isNavDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <ClipboardList size={13} />
              STUDY BUILDER
            </button>
            <button
              onClick={() => { if (!isNavDisabled) navigate(`/projects/${activeProjectId}/results/${selectedStudyId}`); }}
              disabled={isNavDisabled}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-colors duration-150 ${
                currentView === 'results-dashboard'
                  ? 'bg-ml-blue text-white shadow-xs'
                  : 'text-ml-ink-muted hover:text-ml-ink hover:bg-ml-surface'
              } ${isNavDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <BarChart3 size={13} />
              DASHBOARD
            </button>
            <button
              onClick={() => { if (!isNavDisabled) navigate(`/projects/${activeProjectId}/reports/${selectedStudyId}`); }}
              disabled={isNavDisabled}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-colors duration-150 ${
                currentView === 'report-export'
                  ? 'bg-ml-blue text-white shadow-xs'
                  : 'text-ml-ink-muted hover:text-ml-ink hover:bg-ml-surface'
              } ${isNavDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <FileText size={13} />
              REPORTS
            </button>
          </nav>

          {/* Active Scenario Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-white border border-ml-border rounded-full">
            <span className={`w-1.5 h-1.5 rounded-full ${activeProjectId ? 'bg-ml-success animate-pulse' : 'bg-ml-danger'}`}></span>
            <span className="text-[10px] text-ml-ink-muted font-semibold uppercase tracking-wider truncate max-w-[200px]">
              {activeProjectId ? `Active: ${activeProjectName}` : 'No Active Project'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col py-6 relative z-10">
        {currentView === 'project-overview' && (
          <ProjectOverview
            activeProjectId={activeProjectId}
            mode={activeProjectId ? 'detail' : 'list'}
            onSelectProject={handleSelectProject}
            onProjectsChanged={refreshProjects}
            onNavigateToPersonas={() => navigate(`/projects/${activeProjectId}/personas`)}
          />
        )}
        {currentView === 'create-project' && (
          <ProjectOverview
            activeProjectId={null}
            mode="create"
            onSelectProject={handleSelectProject}
            onProjectsChanged={refreshProjects}
            onNavigateToPersonas={() => {}}
          />
        )}
        {currentView === 'edit-project' && (
          <ProjectOverview
            activeProjectId={activeProjectId}
            mode="edit"
            onSelectProject={handleSelectProject}
            onProjectsChanged={refreshProjects}
            onNavigateToPersonas={() => {}}
          />
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
              onClick={() => setCurrentView('project-overview')}
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
              setCurrentView('results-dashboard');
            }}
          />
        )}
        {!isNavDisabled && currentView === 'results-dashboard' && (
          <ResultsDashboard
            studyId={selectedStudyId}
            onNavigateToReports={() => setCurrentView('report-export')}
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
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-medium">
            © {new Date().getFullYear()} <span className="font-extrabold"><span className="text-ml-blue">MARKET</span><span className="text-ml-ink">LAB</span></span>. Developed as part of Synthetic Message Testing PoC.
          </div>
          <div className="flex items-center gap-3 font-semibold">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ml-blue flex items-center gap-0.5 transition-colors duration-150"
            >
              Docs
              <ExternalLink size={12} />
            </a>
            <span className="text-ml-border">|</span>
            <span className="text-ml-warning bg-amber-50 px-2 py-0.5 rounded border border-ml-warning/20">Simulated Research - Human Validation Required</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
