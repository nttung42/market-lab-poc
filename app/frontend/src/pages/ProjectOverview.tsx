import { useEffect, useMemo, useState } from 'react';
import {
  createProject,
  deleteProject,
  getProject,
  getProjectPersonas,
  getProjectRespondents,
  getProjects,
  getProjectStudies,
  updateProject,
} from '../api/client';
import type { Persona, Project, Respondent, Study } from '../types';
import { ProjectOverviewDetailView } from '../features/project-overview/ProjectOverviewDetailView';
import { ProjectOverviewFormView } from '../features/project-overview/ProjectOverviewFormView';
import { ProjectOverviewListView } from '../features/project-overview/ProjectOverviewListView';
import { workspaceSuggestions } from '../features/project-overview/projectOverview.constants';
import {
  buildProjectOverviewMetrics,
  defaultProjectFormValues,
  getErrorMessage,
} from '../features/project-overview/projectOverview.utils';
import type {
  ProjectFormValues,
  ProjectOverviewProps,
} from '../features/project-overview/projectOverview.types';
import { ShieldAlert } from 'lucide-react';

export const ProjectOverview = ({
  activeProjectId,
  mode,
  onSelectProject,
  onProjectsChanged,
  onNavigateToPersonas,
  onCreateProject,
  onEditProject,
  onClose,
}: ProjectOverviewProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] =
    useState<ProjectFormValues>(defaultProjectFormValues);

  const metrics = useMemo(
    () => buildProjectOverviewMetrics(personas, respondents, studies),
    [personas, respondents, studies],
  );

  const resetForm = () => setFormValues(defaultProjectFormValues);

  const applySuggestion = (suggestion: (typeof workspaceSuggestions)[number]) => {
    setFormValues({
      name: suggestion.name,
      product_description: suggestion.product_description,
      industry: suggestion.industry,
      market: suggestion.market,
      target_audience: suggestion.target_audience,
      research_objective: suggestion.research_objective,
      study_type: suggestion.study_type,
    });
  };

  const loadProjectsList = async () => {
    try {
      const list = await getProjects();
      setProjects(list);
    } catch (nextError) {
      console.error(nextError);
      setError(getErrorMessage(nextError, 'Không thể tải danh sách dự án.'));
    }
  };

  const loadActiveProjectDetails = async () => {
    if (!activeProjectId) {
      setProject(null);
      setPersonas([]);
      setRespondents([]);
      setStudies([]);
      return;
    }

    try {
      const [projectData, personasData, respondentsData, studiesData] =
        await Promise.all([
          getProject(activeProjectId),
          getProjectPersonas(activeProjectId),
          getProjectRespondents(activeProjectId),
          getProjectStudies(activeProjectId),
        ]);

      setProject(projectData);
      setPersonas(personasData);
      setRespondents(respondentsData);
      setStudies(studiesData);
    } catch (nextError) {
      console.error(nextError);
      setError(getErrorMessage(nextError, 'Không thể tải chi tiết dự án.'));
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    await Promise.all([loadProjectsList(), loadActiveProjectDetails()]);
    setLoading(false);
  };

  useEffect(() => {
    void loadAllData();
  }, [activeProjectId]);

  useEffect(() => {
    if (mode === 'edit' && project) {
      setFormValues({
        name: project.name,
        product_description: project.product_description,
        industry: project.industry,
        market: project.market,
        target_audience: project.target_audience,
        research_objective: project.research_objective,
        study_type: project.study_type,
      });
      return;
    }

    if (mode === 'create') {
      resetForm();
    }
  }, [mode, project]);

  const handleCreateOrUpdate = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !formValues.name.trim() ||
      !formValues.product_description.trim() ||
      !formValues.industry.trim() ||
      !formValues.market.trim() ||
      !formValues.target_audience.trim() ||
      !formValues.research_objective.trim()
    ) {
      alert('Vui lòng điền đầy đủ tất cả trường.');
      return;
    }

    setSaving(true);
    const payload = {
      name: formValues.name.trim(),
      product_description: formValues.product_description.trim(),
      industry: formValues.industry.trim(),
      market: formValues.market.trim(),
      target_audience: formValues.target_audience.trim(),
      research_objective: formValues.research_objective.trim(),
      study_type: formValues.study_type,
    };

    try {
      if (mode === 'edit' && activeProjectId) {
        const updated = await updateProject(activeProjectId, payload);
        onProjectsChanged();
        onSelectProject(updated.id);
      } else {
        const created = await createProject(payload);
        onProjectsChanged();
        onSelectProject(created.id);
      }

      resetForm();
    } catch (nextError) {
      console.error(nextError);
      alert(getErrorMessage(nextError, 'Không thể lưu dự án.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (
      !confirm(
        'Bạn có chắc muốn xóa dự án này? Thao tác này sẽ xóa vĩnh viễn các chân dung, người tham gia, nghiên cứu và phản hồi liên quan.',
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await deleteProject(projectId);
      if (activeProjectId === projectId) {
        onSelectProject(null);
      }
      onProjectsChanged();
      await loadProjectsList();
    } catch (nextError) {
      console.error(nextError);
      alert(getErrorMessage(nextError, 'Không thể xóa dự án.'));
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'create' || mode === 'edit') {
    return (
      <ProjectOverviewFormView
        activeProjectId={activeProjectId}
        mode={mode}
        loading={loading}
        saving={saving}
        values={formValues}
        onChange={setFormValues}
        onApplySuggestion={applySuggestion}
        onReset={resetForm}
        onSubmit={handleCreateOrUpdate}
        onSelectProject={onSelectProject}
        onClose={onClose}
      />
    );
  }

  if (loading) {
    return (
      <div className="mx-auto flex-1 w-full max-w-5xl space-y-8 px-6 py-12 animate-pulse">
        <div className="h-10 w-2/3 rounded-lg bg-ml-border" />
        <div className="h-32 rounded-lg bg-ml-border" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="h-40 rounded-lg bg-ml-border" />
          <div className="h-40 rounded-lg bg-ml-border" />
        </div>
      </div>
    );
  }

  if (mode === 'list') {
    return (
      <ProjectOverviewListView
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={onSelectProject}
        onCreateProject={onCreateProject}
        onEditProject={onEditProject}
        onDeleteProject={handleDelete}
      />
    );
  }

  if (error || !project) {
    return (
      <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-ml-danger/30 bg-ml-danger/10 text-ml-danger">
          <ShieldAlert size={32} />
        </div>
        <h2 className="mb-2 text-xl font-bold text-ml-ink">Không thể tải dự án</h2>
        <p className="mb-6 text-sm text-ml-ink-muted">
          {error || 'Không thể truy xuất dữ liệu dự án.'}
        </p>
        <button
          onClick={() => onSelectProject(null)}
          className="rounded-lg bg-ml-blue px-4 py-2 font-bold text-white transition-colors duration-150 hover:bg-ml-blue-strong"
        >
          Về danh sách dự án
        </button>
      </div>
    );
  }

  return (
    <ProjectOverviewDetailView
      project={project}
      personas={personas}
      respondents={respondents}
      studies={studies}
      metrics={metrics}
      onNavigateToPersonas={onNavigateToPersonas}
      onEditProject={onEditProject}
      onSelectProject={onSelectProject}
    />
  );
};
