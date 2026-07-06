import React, { useEffect, useState } from 'react';
import type { Persona, Project, Respondent, Study } from '../types';
import projectCardImage from '../assets/project-card-bg.png';
import { 
  getProjects, 
  getProject, 
  getProjectPersonas,
  getProjectRespondents,
  getProjectStudies,
  createProject, 
  updateProject, 
  deleteProject 
} from '../api/client';
import {
  BookOpen, 
  MapPin, 
  Users, 
  Target, 
  Activity, 
  ArrowRight, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Edit, 
  Folder, 
  RefreshCw,
  X,
  BarChart3,
  ClipboardList,
  CheckCircle2,
  Clock3,
  Layers3,
  CalendarDays
} from 'lucide-react';

type WorkspaceSuggestion = {
  label: string;
  name: string;
  product_description: string;
  industry: string;
  market: string;
  target_audience: string;
  research_objective: string;
  study_type: string;
};

const workspaceSuggestions: WorkspaceSuggestion[] = [
  {
    label: 'AI English Coach',
    name: 'AI Business English Coach',
    product_description: 'An AI speaking coach that helps early-career professionals practice business English, prepare for meetings, and get feedback on clarity and confidence.',
    industry: 'EdTech, SaaS',
    market: 'Vietnam, Southeast Asia',
    target_audience: 'University students, junior professionals',
    research_objective: 'Choose the stronger messaging angle for confidence-building versus convenience.',
    study_type: 'Synthetic Concept / Message Test',
  },
  {
    label: 'SME Sales Dashboard',
    name: 'Social Commerce Sales Dashboard',
    product_description: 'A lightweight analytics workspace that helps small online sellers track orders, campaigns, and repeat buyers across social commerce channels.',
    industry: 'RetailTech, SaaS',
    market: 'Vietnam',
    target_audience: 'SME owners, social commerce operators',
    research_objective: 'Identify which positioning drives more interest: growth visibility or time-saving operations.',
    study_type: 'Synthetic Concept / Message Test',
  },
  {
    label: 'Skincare Routine App',
    name: 'Personalized Skincare Routine App',
    product_description: 'A mobile app that recommends simple skincare routines based on skin concerns, budget, and lifestyle, then nudges users to stay consistent.',
    industry: 'Consumer Health, Mobile App',
    market: 'Urban Vietnam',
    target_audience: 'Gen Z and millennial skincare shoppers',
    research_objective: 'Test whether trust-led or convenience-led messaging resonates more strongly.',
    study_type: 'Synthetic Concept / Message Test',
  },
];

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

const formatDate = (value?: string) => {
  if (!value) {
    return 'N/A';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'N/A';
  }

  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

interface ProjectOverviewProps {
  activeProjectId: string | null;
  mode: 'list' | 'detail' | 'create' | 'edit';
  onSelectProject: (projectId: string | null) => void;
  onProjectsChanged: () => void;
  onNavigateToPersonas: () => void;
  onCreateProject: () => void;
  onEditProject: (projectId: string) => void;
  onClose?: () => void;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  activeProjectId,
  mode,
  onSelectProject,
  onProjectsChanged,
  onNavigateToPersonas,
  onCreateProject,
  onEditProject,
  onClose,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form State for Create/Edit
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formIndustry, setFormIndustry] = useState('');
  const [formMarket, setFormMarket] = useState('');
  const [formAudience, setFormAudience] = useState('');
  const [formObjective, setFormObjective] = useState('');
  const [formStudyType, setFormStudyType] = useState('Synthetic Concept / Message Test');

  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setFormName('');
    setFormDesc('');
    setFormIndustry('');
    setFormMarket('');
    setFormAudience('');
    setFormObjective('');
    setFormStudyType('Synthetic Concept / Message Test');
  };

  const applySuggestion = (suggestion: WorkspaceSuggestion) => {
    setFormName(suggestion.name);
    setFormDesc(suggestion.product_description);
    setFormIndustry(suggestion.industry);
    setFormMarket(suggestion.market);
    setFormAudience(suggestion.target_audience);
    setFormObjective(suggestion.research_objective);
    setFormStudyType(suggestion.study_type);
  };

  const loadProjectsList = async () => {
    try {
      const list = await getProjects();
      setProjects(list);
    } catch (error: unknown) {
      console.error(error);
      setError(getErrorMessage(error, 'Failed to load projects list.'));
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
      const [projectData, personasData, respondentsData, studiesData] = await Promise.all([
        getProject(activeProjectId),
        getProjectPersonas(activeProjectId),
        getProjectRespondents(activeProjectId),
        getProjectStudies(activeProjectId),
      ]);
      setProject(projectData);
      setPersonas(personasData);
      setRespondents(respondentsData);
      setStudies(studiesData);
    } catch (error: unknown) {
      console.error(error);
      setError(getErrorMessage(error, 'Failed to load project details.'));
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    await Promise.all([loadProjectsList(), loadActiveProjectDetails()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, [activeProjectId]);

  // Sync form state when project details or mode changes
  useEffect(() => {
    if (mode === 'edit' && project) {
      setFormName(project.name);
      setFormDesc(project.product_description);
      setFormIndustry(project.industry);
      setFormMarket(project.market);
      setFormAudience(project.target_audience);
      setFormObjective(project.research_objective);
      setFormStudyType(project.study_type);
    } else if (mode === 'create') {
      resetForm();
    }
  }, [mode, project]);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDesc.trim() || !formIndustry.trim() || !formMarket.trim() || !formAudience.trim() || !formObjective.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    setSaving(true);
    const projectPayload = {
      name: formName.trim(),
      product_description: formDesc.trim(),
      industry: formIndustry.trim(),
      market: formMarket.trim(),
      target_audience: formAudience.trim(),
      research_objective: formObjective.trim(),
      study_type: formStudyType
    };

    try {
      if (mode === 'edit' && activeProjectId) {
        // Update
        const updated = await updateProject(activeProjectId, projectPayload);
        onProjectsChanged();
        onSelectProject(updated.id);
      } else {
        // Create
        const created = await createProject(projectPayload);
        onProjectsChanged();
        onSelectProject(created.id);
      }
      
      resetForm();
    } catch (error: unknown) {
      console.error(error);
      alert(getErrorMessage(error, 'Error saving project.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project? This will permanently delete all associated personas, respondents, studies, and responses.')) {
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
    } catch (error: unknown) {
      console.error(error);
      alert(getErrorMessage(error, 'Error deleting project.'));
    } finally {
      setLoading(false);
    }
  };

  // --- CREATE OR EDIT MODE ---
  if (mode === 'create' || mode === 'edit') {
    if (loading && mode === 'edit') {
      return (
        <div className="w-full p-8 animate-pulse space-y-8">
          <div className="h-8 bg-ml-border rounded-lg w-2/3"></div>
          <div className="h-64 bg-ml-border rounded-lg"></div>
        </div>
      );
    }

    return (
      <div className="flex max-h-full w-full flex-col overflow-y-auto p-5 md:p-6 text-ml-ink">
        <div className="flex items-center justify-between border-b border-ml-border/60 pb-4">
          <h2 className="text-sm font-black uppercase tracking-wider flex items-center gap-1.5">
            {mode === 'edit' ? <Edit className="text-ml-blue" size={16} /> : <Plus className="text-ml-blue" size={16} />}
            {mode === 'edit' ? 'Edit Research Workspace' : 'Initialize Research Workspace'}
          </h2>
          {onClose && (
            <button 
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-ml-surface rounded-full text-ml-ink-muted transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="pt-5">
          <form onSubmit={handleCreateOrUpdate} className="space-y-4 text-xs font-medium">
            {mode === 'create' && (
              <div className="space-y-2 rounded-lg border border-ml-border bg-ml-surface/60 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-ml-ink-muted">Quick-Start Suggestions</div>
                    <p className="mt-1 text-[11px] font-medium text-ml-ink-muted">
                      Tap a preset to auto-fill the form.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="shrink-0 rounded-md border border-ml-border bg-white px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ml-ink hover:border-ml-blue/40 hover:text-ml-blue transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {workspaceSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.label}
                      type="button"
                      onClick={() => applySuggestion(suggestion)}
                      className="rounded-full border border-ml-border bg-white px-3 py-2 text-left transition-colors hover:border-ml-blue/40 hover:bg-ml-blue-soft/20 cursor-pointer"
                    >
                      <div className="text-[11px] font-black uppercase tracking-wider text-ml-ink">
                        {suggestion.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Product Name / Concept</label>
              <input
                type="text"
                placeholder="e.g., AI Business English Coach"
                value={formName}
                onChange={e => setFormName(e.target.value)}
                className="w-full border border-ml-border px-4 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-ml-blue bg-white text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Product Description</label>
              <textarea
                placeholder="What does it do, and how does it create value for users?"
                value={formDesc}
                onChange={e => setFormDesc(e.target.value)}
                rows={3}
                className="w-full border border-ml-border px-4 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-ml-blue bg-white resize-none text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Industry</label>
                <input
                  type="text"
                  placeholder="e.g., EdTech, SaaS"
                  value={formIndustry}
                  onChange={e => setFormIndustry(e.target.value)}
                  className="w-full border border-ml-border px-4 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-ml-blue bg-white text-sm"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Market / Location</label>
                <input
                  type="text"
                  placeholder="e.g., Vietnam, Southeast Asia"
                  value={formMarket}
                  onChange={e => setFormMarket(e.target.value)}
                  className="w-full border border-ml-border px-4 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-ml-blue bg-white text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Target Audience</label>
                <input
                  type="text"
                  placeholder="e.g., University students, junior developers"
                  value={formAudience}
                  onChange={e => setFormAudience(e.target.value)}
                  className="w-full border border-ml-border px-4 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-ml-blue bg-white text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Research Objective</label>
                <input
                  type="text"
                  placeholder="e.g., Choose the stronger messaging angle"
                  value={formObjective}
                  onChange={e => setFormObjective(e.target.value)}
                  className="w-full border border-ml-border px-4 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-ml-blue bg-white text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Study Methodology</label>
              <select
                value={formStudyType}
                onChange={e => setFormStudyType(e.target.value)}
                className="w-full bg-white border border-ml-border px-4 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-ml-blue text-sm"
              >
                <option value="Synthetic Concept / Message Test">Synthetic Concept / Message Test</option>
                <option value="Pricing Sensitivity Test">Pricing Sensitivity Test</option>
                <option value="Feature Prioritization survey">Feature Prioritization survey</option>
              </select>
            </div>

             <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (onClose) {
                    onClose();
                  } else if (mode === 'edit' && activeProjectId) {
                    onSelectProject(activeProjectId);
                  } else {
                    onSelectProject(null);
                  }
                }}
                className="flex-1 py-3 px-4 border border-ml-border hover:bg-ml-surface text-ml-ink text-xs font-bold rounded-lg transition-colors cursor-pointer text-center"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 bg-ml-blue hover:bg-ml-blue-strong disabled:bg-ml-border text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                {saving ? <RefreshCw size={14} className="animate-spin" /> : mode === 'edit' ? 'UPDATE WORKSPACE' : 'INITIALIZE WORKSPACE'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- LIST MODE ---
  if (mode === 'list') {
    if (loading) {
      return (
        <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 animate-pulse space-y-8">
          <div className="h-10 bg-ml-border rounded-lg w-2/3"></div>
          <div className="h-32 bg-ml-border rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-40 bg-ml-border rounded-lg"></div>
            <div className="h-40 bg-ml-border rounded-lg"></div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-8 text-ml-ink">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ml-border pb-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase flex items-center gap-2">
              <Folder className="text-ml-blue" size={28} />
              Project Directory
            </h1>
            <p className="text-sm text-ml-ink-muted font-medium mt-1">
              Select an active customer research workspace or create a new one.
            </p>
          </div>
          <button
            onClick={onCreateProject}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-ml-blue hover:bg-ml-blue-strong text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer transition-colors"
          >
            <Plus size={14} />
            INITIALIZE NEW WORKSPACE
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-bold text-ml-ink-muted uppercase tracking-wider">Available Workspaces ({projects.length})</h2>
          
          {projects.length === 0 ? (
            <div className="text-center py-20 bg-white border border-ml-border border-dashed rounded-lg space-y-4 shadow-2xs">
              <Folder size={48} className="mx-auto text-ml-border" />
              <h3 className="text-sm font-bold uppercase tracking-wider">No Workspaces Found</h3>
              <p className="text-xs text-ml-ink-muted max-w-xs mx-auto">Create your first concept workspace to start testing messages.</p>
              <button
                onClick={onCreateProject}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-ml-blue hover:bg-ml-blue-strong text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                <Plus size={14} /> Initialize Workspace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {projects.map((proj) => {
                const isActive = activeProjectId === proj.id;
                const projectInitial = proj.name.trim().charAt(0).toUpperCase() || 'M';
                return (
                  <article 
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(proj.id);
                    }}
                    className={`group grid min-h-[220px] cursor-pointer overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-150 sm:grid-cols-[40fr_60fr] ${
                      isActive ? 'border-ml-blue shadow-md ring-1 ring-ml-blue/20' : 'border-ml-border hover:border-ml-blue/40 hover:shadow-md'
                    }`}
                  >
                    <div
                      className="relative min-h-[180px] bg-cover bg-left sm:min-h-full"
                      style={{ backgroundImage: `url(${projectCardImage})` }}
                    >
                      <div className="absolute inset-0 bg-ml-ink/10" />
                      <div className="absolute inset-0 bg-gradient-to-br from-ml-blue/45 via-transparent to-ml-ink/35" />
                      <div className="relative flex h-full min-h-[180px] flex-col justify-between p-5 text-white">
                        <div className="flex items-center gap-2">
                          <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/30 bg-white/20 text-lg font-black backdrop-blur-sm">
                            {projectInitial}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wider text-white/80">Research Workspace</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {proj.is_seeded && (
                            <span className="rounded border border-white/30 bg-white/20 px-2 py-1 text-[9px] font-black uppercase tracking-wider backdrop-blur-sm">
                              Demo
                            </span>
                          )}
                          {isActive && (
                            <span className="rounded border border-white/40 bg-white px-2 py-1 text-[9px] font-black uppercase tracking-wider text-ml-blue">
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-col justify-between gap-5 p-5 sm:p-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="min-w-0 text-lg font-black uppercase tracking-normal text-ml-ink transition-colors duration-100 group-hover:text-ml-blue">
                            {proj.name}
                          </h3>
                          <ArrowRight size={18} className="mt-1 shrink-0 text-ml-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-ml-blue" />
                        </div>
                        <p className="text-sm font-medium leading-6 text-ml-ink-muted line-clamp-3">
                          {proj.product_description}
                        </p>
                        <div className="grid grid-cols-1 gap-2 text-[10px] font-bold uppercase text-ml-ink-muted sm:grid-cols-2">
                          <span className="rounded border border-ml-border bg-ml-surface px-2 py-1">{proj.industry}</span>
                          <span className="rounded border border-ml-border bg-ml-surface px-2 py-1">{proj.market}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-ml-border/60 pt-4" onClick={e => e.stopPropagation()}>
                        <span className="text-[10px] font-black uppercase tracking-wider text-ml-ink/80 transition-colors group-hover:text-ml-blue">
                          Open Workspace
                        </span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => onEditProject(proj.id)}
                            className="p-2 border border-ml-border hover:border-ml-blue/30 hover:bg-ml-blue-soft/20 text-ml-ink-muted hover:text-ml-blue rounded-lg transition-colors cursor-pointer"
                            title="Edit Workspace"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={(e) => handleDelete(proj.id, e)}
                            className="p-2 border border-ml-border hover:border-ml-danger/30 hover:bg-ml-danger/10 text-ml-ink-muted hover:text-ml-danger rounded-lg transition-colors cursor-pointer"
                            title="Delete Workspace"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- DETAIL MODE ---
  if (loading) {
    return (
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 animate-pulse space-y-8">
        <div className="h-10 bg-ml-border rounded-lg w-2/3"></div>
        <div className="h-32 bg-ml-border rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-40 bg-ml-border rounded-lg"></div>
          <div className="h-40 bg-ml-border rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto px-6 py-12 text-center">
        <div className="w-16 h-16 bg-ml-danger/10 border border-ml-danger/30 rounded-full flex items-center justify-center text-ml-danger mb-4">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-xl font-bold text-ml-ink mb-2">Failed to Load Project</h2>
        <p className="text-sm text-ml-ink-muted mb-6">{error || 'Project data could not be retrieved.'}</p>
        <button
          onClick={() => onSelectProject(null)}
          className="px-4 py-2 bg-ml-blue hover:bg-ml-blue-strong text-white font-bold rounded-lg transition-colors duration-150"
        >
          Go to Directory
        </button>
      </div>
    );
  }

  const completedStudies = studies.filter((study) => study.status === 'completed');
  const draftStudies = studies.filter((study) => study.status === 'draft');
  const totalQuestions = studies.reduce((sum, study) => sum + (study.questions?.length ?? 0), 0);
  const avgConfidence = personas.length
    ? Math.round(personas.reduce((sum, persona) => sum + persona.confidence_score, 0) / personas.length)
    : 0;
  const readinessSteps = [
    { label: 'Personas defined', complete: personas.length > 0, value: `${personas.length}` },
    { label: 'Respondent panel ready', complete: respondents.length > 0, value: `${respondents.length}` },
    { label: 'Study drafted', complete: studies.length > 0, value: `${studies.length}` },
    { label: 'Results available', complete: completedStudies.length > 0, value: `${completedStudies.length}` },
  ];
  const readinessCompleted = readinessSteps.filter((step) => step.complete).length;
  const readinessPercent = Math.round((readinessCompleted / readinessSteps.length) * 100);
  const latestStudy = [...studies].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] ?? null;
  const topChannels = Array.from(
    new Set(personas.flatMap((persona) => persona.channels).filter(Boolean))
  ).slice(0, 4);
  const personaHighlights = personas.slice(0, 3);
  const statusTone =
    readinessPercent >= 100
      ? 'Ready to review simulated findings'
      : readinessPercent >= 50
        ? 'Core setup in progress'
        : 'Needs setup before downstream modules';

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-5 py-6 md:px-6 md:py-8 space-y-6 text-ml-ink">
      <section className="overflow-hidden rounded-xl border border-ml-border bg-white">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.7fr)_360px]">
          <div className="relative overflow-hidden border-b border-ml-border bg-[linear-gradient(135deg,rgba(57,130,203,0.14),rgba(255,255,255,0.98)_58%)] p-6 md:p-8 lg:border-b-0 lg:border-r">
            <div className="absolute inset-y-0 right-0 hidden w-40 bg-[radial-gradient(circle_at_center,rgba(57,130,203,0.14),transparent_70%)] lg:block" />
            <div className="relative space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-ml-blue/20 bg-ml-blue-soft px-3 py-1 text-[10px] font-black uppercase tracking-wider text-ml-blue">
                  <BarChart3 size={12} />
                  Active Workspace
                </span>
                {project.is_seeded && (
                  <span className="rounded-full border border-ml-border bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-ml-ink">
                    Seeded Demo
                  </span>
                )}
                <span className="rounded-full border border-ml-border bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">
                  Created {formatDate(project.created_at)}
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="max-w-4xl text-[28px] font-black uppercase leading-tight md:text-[38px]">
                  {project.name}
                </h1>
                <p className="max-w-3xl text-sm font-medium leading-7 text-ml-ink-muted md:text-[15px]">
                  {project.product_description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-ml-border bg-white/90 p-3">
                  <div className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">Industry</div>
                  <div className="mt-1 text-sm font-bold text-ml-ink">{project.industry}</div>
                </div>
                <div className="rounded-lg border border-ml-border bg-white/90 p-3">
                  <div className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">Market</div>
                  <div className="mt-1 text-sm font-bold text-ml-ink">{project.market}</div>
                </div>
                <div className="rounded-lg border border-ml-border bg-white/90 p-3">
                  <div className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">Method</div>
                  <div className="mt-1 text-sm font-bold text-ml-ink">{project.study_type}</div>
                </div>
              </div>
            </div>
          </div>

          <aside className="flex flex-col justify-between gap-5 border-t border-ml-border bg-[linear-gradient(180deg,rgba(219,234,250,0.72),rgba(255,255,255,0.98))] p-6 text-ml-ink lg:border-t-0">
            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-ml-blue">Workspace Readiness</div>
                <div className="mt-2 text-3xl font-black text-ml-ink">{readinessPercent}%</div>
                <p className="mt-1 text-sm font-semibold leading-6 text-ml-ink-muted">{statusTone}</p>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-ml-blue-soft/70">
                <div
                  className="h-full rounded-full bg-ml-blue transition-all"
                  style={{ width: `${readinessPercent}%` }}
                />
              </div>

              <div className="space-y-2">
                {readinessSteps.map((step) => (
                  <div key={step.label} className="flex items-center justify-between rounded-lg border border-ml-border bg-white px-3 py-2.5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className={step.complete ? 'text-ml-blue' : 'text-ml-ink-muted/40'} />
                      <span className="text-xs font-semibold text-ml-ink">{step.label}</span>
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-ml-blue">{step.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={onNavigateToPersonas}
                className="group flex items-center justify-center gap-2 rounded-lg bg-ml-blue px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-ml-blue-strong cursor-pointer"
              >
                Open Persona Catalog
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => onEditProject(project.id)}
                  className="flex-1 rounded-lg border border-ml-border bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-ml-ink transition-colors hover:border-ml-blue/30 hover:bg-ml-blue-soft/25 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => onSelectProject(null)}
                  className="flex-1 rounded-lg border border-ml-border bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-ml-blue transition-colors hover:border-ml-blue/30 hover:bg-ml-blue-soft/25 cursor-pointer"
                >
                  Switch
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-ml-border bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">Personas</span>
            <Users className="text-ml-blue" size={16} />
          </div>
          <div className="mt-3 text-3xl font-black text-ml-ink">{personas.length}</div>
          <p className="mt-2 text-xs font-medium leading-5 text-ml-ink-muted">
            Avg. confidence {avgConfidence}% across the current audience model set.
          </p>
        </article>

        <article className="rounded-lg border border-ml-border bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">Respondents</span>
            <Layers3 className="text-ml-blue" size={16} />
          </div>
          <div className="mt-3 text-3xl font-black text-ml-ink">{respondents.length}</div>
          <p className="mt-2 text-xs font-medium leading-5 text-ml-ink-muted">
            Synthetic panel size currently available for simulation runs.
          </p>
        </article>

        <article className="rounded-lg border border-ml-border bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">Studies</span>
            <ClipboardList className="text-ml-blue" size={16} />
          </div>
          <div className="mt-3 text-3xl font-black text-ml-ink">{studies.length}</div>
          <p className="mt-2 text-xs font-medium leading-5 text-ml-ink-muted">
            {completedStudies.length} completed, {draftStudies.length} draft, {totalQuestions} total questions.
          </p>
        </article>

        <article className="rounded-lg border border-ml-border bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">Latest Activity</span>
            <CalendarDays className="text-ml-blue" size={16} />
          </div>
          <div className="mt-3 text-lg font-black leading-tight text-ml-ink">
            {latestStudy ? formatDate(latestStudy.created_at) : 'No study yet'}
          </div>
          <p className="mt-2 text-xs font-medium leading-5 text-ml-ink-muted">
            {latestStudy ? `${latestStudy.title} is the most recent study in this workspace.` : 'Create a study to start capturing simulated findings.'}
          </p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)]">
        <div className="space-y-6">
          <article className="rounded-lg border border-ml-border bg-white p-5 md:p-6">
            <div className="flex items-center gap-2 border-b border-ml-border pb-3">
              <Target className="text-ml-blue" size={18} />
              <h2 className="text-base font-black uppercase tracking-wide text-ml-ink">Research Snapshot</h2>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-md bg-ml-surface p-2 text-ml-ink-muted">
                    <Activity size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">Research Objective</div>
                    <div className="mt-1 text-sm font-semibold leading-6 text-ml-ink">{project.research_objective}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-md bg-ml-surface p-2 text-ml-ink-muted">
                    <Users size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">Target Audience</div>
                    <div className="mt-1 text-sm font-semibold leading-6 text-ml-ink">{project.target_audience}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-md bg-ml-surface p-2 text-ml-ink-muted">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">Market Context</div>
                    <div className="mt-1 text-sm font-semibold leading-6 text-ml-ink">{project.market}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-md bg-ml-surface p-2 text-ml-ink-muted">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">Study Method</div>
                    <div className="mt-1 text-sm font-semibold leading-6 text-ml-ink">{project.study_type}</div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-lg border border-ml-border bg-white p-5 md:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-ml-border pb-3">
              <div className="flex items-center gap-2">
                <Users className="text-ml-blue" size={18} />
                <h2 className="text-base font-black uppercase tracking-wide text-ml-ink">Persona Coverage</h2>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">{personas.length} segments</span>
            </div>

            {personaHighlights.length === 0 ? (
              <div className="mt-5 rounded-lg border border-dashed border-ml-border bg-ml-surface/60 p-5 text-sm font-medium text-ml-ink-muted">
                No persona set yet. Add audience segments to unlock more meaningful downstream simulations.
              </div>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {personaHighlights.map((persona) => (
                  <article key={persona.id} className="rounded-lg border border-ml-border bg-ml-surface/45 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-black text-ml-ink">{persona.name}</div>
                        <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-ml-ink-muted">{persona.segment}</div>
                      </div>
                      <span className="rounded-full border border-ml-blue/20 bg-white px-2 py-1 text-[10px] font-black uppercase tracking-wider text-ml-blue">
                        {persona.confidence_score}%
                      </span>
                    </div>
                    <p className="mt-3 text-xs font-medium leading-5 text-ml-ink-muted line-clamp-4">
                      {persona.quote}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {persona.channels.slice(0, 2).map((channel) => (
                        <span key={channel} className="rounded border border-ml-border bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-ml-ink-muted">
                          {channel}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </article>
        </div>

        <div className="space-y-6">
          <article className="rounded-lg border border-ml-border bg-white p-5">
            <div className="flex items-center gap-2 border-b border-ml-border pb-3">
              <Clock3 className="text-ml-blue" size={18} />
              <h2 className="text-base font-black uppercase tracking-wide text-ml-ink">Study Activity</h2>
            </div>

            {latestStudy ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-lg border border-ml-border bg-ml-surface/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-black text-ml-ink">{latestStudy.title}</div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                      latestStudy.status === 'completed'
                        ? 'bg-ml-blue-soft text-ml-blue'
                        : 'bg-ml-surface text-ml-ink-muted'
                    }`}>
                      {latestStudy.status}
                    </span>
                  </div>
                  <div className="mt-3 text-xs font-medium leading-5 text-ml-ink-muted">
                    Created on {formatDate(latestStudy.created_at)} with {latestStudy.questions?.length ?? 0} questions configured.
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-ml-border p-3">
                    <div className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">Completed Studies</div>
                    <div className="mt-2 text-2xl font-black text-ml-ink">{completedStudies.length}</div>
                  </div>
                  <div className="rounded-lg border border-ml-border p-3">
                    <div className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">Question Bank</div>
                    <div className="mt-2 text-2xl font-black text-ml-ink">{totalQuestions}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-lg border border-dashed border-ml-border bg-ml-surface/60 p-5 text-sm font-medium leading-6 text-ml-ink-muted">
                This workspace does not have any study yet. Create one from Study Builder after you finish the audience setup.
              </div>
            )}
          </article>

          <article className="rounded-lg border border-ml-border bg-white p-5">
            <div className="flex items-center gap-2 border-b border-ml-border pb-3">
              <CheckCircle2 className="text-ml-blue" size={18} />
              <h2 className="text-base font-black uppercase tracking-wide text-ml-ink">Signal Summary</h2>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">Top Channels</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {topChannels.length > 0 ? topChannels.map((channel) => (
                    <span key={channel} className="rounded-full border border-ml-border bg-ml-surface px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-ml-ink">
                      {channel}
                    </span>
                  )) : (
                    <span className="text-sm font-medium text-ml-ink-muted">No channel signals yet.</span>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-ml-blue/20 bg-ml-blue-soft/55 p-4">
                <div className="text-[10px] font-black uppercase tracking-wider text-ml-blue">Simulation Note</div>
                <p className="mt-2 text-xs font-medium leading-5 text-ml-ink">
                  Workspace metrics and downstream insights are synthetic directional signals, useful for fast concept exploration before human validation.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};
