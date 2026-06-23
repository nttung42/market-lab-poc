import { useState } from 'react';
import { ProjectOverview } from './pages/ProjectOverview';
import { PersonaCatalog } from './pages/PersonaCatalog';
import { Layout, Users, ExternalLink } from 'lucide-react';

type View = 'project-overview' | 'persona-catalog';

function App() {
  const [currentView, setCurrentView] = useState<View>('project-overview');
  const activeProjectId = 'english-learning-app-poc';

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
          <nav className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentView('project-overview')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-md transition-colors duration-150 ${
                currentView === 'project-overview'
                  ? 'bg-ml-blue text-white'
                  : 'text-ml-ink-muted hover:text-ml-ink hover:bg-ml-blue-soft/50'
              }`}
            >
              <Layout size={14} />
              PROJECT OVERVIEW
            </button>
            <button
              onClick={() => setCurrentView('persona-catalog')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-md transition-colors duration-150 ${
                currentView === 'persona-catalog'
                  ? 'bg-ml-blue text-white'
                  : 'text-ml-ink-muted hover:text-ml-ink hover:bg-ml-blue-soft/50'
              }`}
            >
              <Users size={14} />
              PERSONA CATALOG
            </button>
          </nav>

          {/* Active Scenario Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white border border-ml-border rounded-full">
            <span className="w-1.5 h-1.5 bg-ml-success rounded-full animate-pulse"></span>
            <span className="text-[10px] text-ml-ink-muted font-semibold uppercase tracking-wider">Active: English App Demo</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col py-6 relative z-10">
        {currentView === 'project-overview' ? (
          <ProjectOverview
            projectId={activeProjectId}
            onNavigateToPersonas={() => setCurrentView('persona-catalog')}
          />
        ) : (
          <PersonaCatalog projectId={activeProjectId} />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-ml-border py-6 bg-white text-center text-[11px] text-ml-ink-muted relative z-10">
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
