import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router';
import {
  LandingLayout,
  LandingHome,
  LandingFeatures,
  LandingProcess,
  LandingReviews,
  LandingFaq,
  LandingPricing,
} from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { PersonaCatalog } from './pages/PersonaCatalog';
import { ProjectOverview } from './pages/ProjectOverview';
import { ReportExport } from './pages/ReportExport';
import { RespondentsDashboard } from './pages/RespondentsDashboard';
import { ResultsDashboard } from './pages/ResultsDashboard';
import { StudyBuilder } from './pages/StudyBuilder';
import {
  WorkspaceShell,
  useWorkspaceContext,
  appRoutes,
  defaultStudyId,
} from './components/WorkspaceShell';

const LegacyProjectsRedirect = () => {
  const location = useLocation();
  const nextPath = location.pathname.replace(/^\/projects/, '/project') || appRoutes.workspaceRoot;

  return <Navigate to={`${nextPath}${location.search}${location.hash}`} replace />;
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
      <div className="fixed inset-0 bg-ml-ink/40 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
        <div className="relative w-full max-w-4xl max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-3rem)] overflow-hidden rounded-2xl border border-ml-border/60 bg-white shadow-xl zoom-in duration-200">
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
      <div className="fixed inset-0 bg-ml-ink/40 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
        <div className="relative w-full max-w-4xl max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-3rem)] overflow-hidden rounded-2xl border border-ml-border/60 bg-white shadow-xl zoom-in duration-200">
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
  const navigate = useNavigate();

  return (
    <Routes>
      <Route element={<LandingLayout onStart={() => navigate(appRoutes.login)} />}>
        <Route path="/" element={<LandingHome onStart={() => navigate(appRoutes.login)} />} />
        <Route path="/features" element={<LandingFeatures onStart={() => navigate(appRoutes.login)} />} />
        <Route path="/process" element={<LandingProcess />} />
        <Route path="/reviews" element={<LandingReviews />} />
        <Route path="/faq" element={<LandingFaq />} />
        <Route path="/pricing" element={<LandingPricing />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/landing" element={<Navigate to="/" replace />} />
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
