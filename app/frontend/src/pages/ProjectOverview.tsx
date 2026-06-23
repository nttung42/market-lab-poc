import React, { useEffect, useState } from 'react';
import type { Project } from '../types';
import { 
  getProjects, 
  getProject, 
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
  RefreshCw
} from 'lucide-react';

interface ProjectOverviewProps {
  activeProjectId: string | null;
  mode: 'list' | 'detail' | 'create' | 'edit';
  onSelectProject: (projectId: string | null) => void;
  onProjectsChanged: () => void;
  onNavigateToPersonas: () => void;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  activeProjectId,
  mode,
  onSelectProject,
  onProjectsChanged,
  onNavigateToPersonas,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);
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

  const loadProjectsList = async () => {
    try {
      const list = await getProjects();
      setProjects(list);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load projects list.');
    }
  };

  const loadActiveProjectDetails = async () => {
    if (!activeProjectId) {
      setProject(null);
      return;
    }
    try {
      const data = await getProject(activeProjectId);
      setProject(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load project details.');
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
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error saving project.');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormName('');
    setFormDesc('');
    setFormIndustry('');
    setFormMarket('');
    setFormAudience('');
    setFormObjective('');
    setFormStudyType('Synthetic Concept / Message Test');
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
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error deleting project.');
    } finally {
      setLoading(false);
    }
  };

  // --- CREATE OR EDIT MODE ---
  if (mode === 'create' || mode === 'edit') {
    if (loading && mode === 'edit') {
      return (
        <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-12 animate-pulse space-y-8">
          <div className="h-10 bg-ml-border rounded-lg w-2/3"></div>
          <div className="h-64 bg-ml-border rounded-lg"></div>
        </div>
      );
    }

    return (
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 space-y-6 text-ml-ink">
        <div className="flex items-center gap-2 border-b border-ml-border pb-5">
          <h1 className="text-2xl font-black tracking-tight uppercase flex items-center gap-2">
            {mode === 'edit' ? <Edit className="text-ml-blue" size={26} /> : <Plus className="text-ml-blue" size={26} />}
            {mode === 'edit' ? 'Edit Research Workspace' : 'Initialize Research Workspace'}
          </h1>
        </div>

        <div className="bg-white border border-ml-border rounded-lg p-8 shadow-xs">
          <form onSubmit={handleCreateOrUpdate} className="space-y-5 text-xs font-medium">
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
                rows={4}
                className="w-full border border-ml-border px-4 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-ml-blue bg-white resize-none text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  if (mode === 'edit' && activeProjectId) {
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
            onClick={() => window.location.hash = '/create-project'}
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
                onClick={() => window.location.hash = '/create-project'}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-ml-blue hover:bg-ml-blue-strong text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                <Plus size={14} /> Initialize Workspace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => {
                const isActive = activeProjectId === proj.id;
                return (
                  <div 
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(proj.id);
                    }}
                    className={`group p-6 bg-white border rounded-lg shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer relative overflow-hidden flex flex-col justify-between gap-4 ${
                      isActive ? 'border-ml-blue border-l-4 border-l-ml-blue' : 'border-ml-border hover:border-ml-blue/40'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <h3 className="text-base font-black uppercase tracking-tight text-ml-ink group-hover:text-ml-blue transition-colors duration-100 truncate">
                            {proj.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {proj.is_seeded && (
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">
                              Demo
                            </span>
                          )}
                          {isActive && (
                            <span className="text-[9px] font-bold text-ml-blue bg-ml-blue-soft px-2 py-0.5 rounded border border-ml-blue/20 uppercase tracking-wider">
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-ml-ink-muted font-medium line-clamp-2 leading-relaxed">
                        {proj.product_description}
                      </p>
                      <div className="flex flex-wrap gap-2 text-[10px] text-ml-ink-muted font-bold uppercase pt-1">
                        <span className="px-2 py-0.5 bg-ml-surface border border-ml-border rounded">{proj.industry}</span>
                        <span className="px-2 py-0.5 bg-ml-surface border border-ml-border rounded">{proj.market}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-ml-border/50 pt-4 mt-2" onClick={e => e.stopPropagation()}>
                      <span className="text-[10px] font-bold text-ml-ink/80 group-hover:text-ml-blue transition-colors flex items-center gap-0.5">
                        OPEN WORKSPACE <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => window.location.hash = `/projects/${proj.id}/edit`}
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

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-8 text-ml-ink">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg border border-ml-border bg-white p-8 md:p-12 border-l-4 border-l-ml-blue shadow-xs">
        <div className="relative space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider text-ml-blue bg-ml-blue-soft border border-ml-blue/20 rounded-full uppercase">
              Active Workspace
            </span>
            <button
              onClick={() => onSelectProject(null)}
              className="px-3 py-1 text-xs font-bold text-ml-ink-muted hover:text-ml-ink hover:bg-ml-surface rounded-full border border-ml-border transition-colors cursor-pointer"
            >
              Switch Workspace
            </button>
          </div>
          <h1 className="text-[30px] md:text-[40px] font-black tracking-tight text-ml-ink leading-tight uppercase">
            {project.name}
          </h1>
          <p className="text-[15px] md:text-[16px] text-ml-ink-muted font-medium leading-relaxed">
            {project.product_description}
          </p>
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Metadata */}
        <div className="rounded-lg border border-ml-border bg-white p-6 space-y-6">
          <h2 className="text-lg font-bold text-ml-ink border-b border-ml-border pb-3 flex items-center gap-2">
            <BookOpen className="text-ml-blue" size={20} />
            Market Context
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-ml-surface text-ml-ink-muted mt-0.5">
                <MapPin size={18} />
              </div>
              <div>
                <div className="text-[11px] text-ml-ink-muted font-bold uppercase tracking-wider">Market / Country</div>
                <div className="text-[15px] font-bold text-ml-ink mt-0.5">{project.market}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-ml-surface text-ml-ink-muted mt-0.5">
                <Activity size={18} />
              </div>
              <div>
                <div className="text-[11px] text-ml-ink-muted font-bold uppercase tracking-wider">Industry Segment</div>
                <div className="text-[15px] font-bold text-ml-ink mt-0.5">{project.industry}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-ml-surface text-ml-ink-muted mt-0.5">
                <Users size={18} />
              </div>
              <div>
                <div className="text-[11px] text-ml-ink-muted font-bold uppercase tracking-wider">Target Demographics</div>
                <div className="text-[15px] font-bold text-ml-ink mt-0.5">{project.target_audience}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Research Objective */}
        <div className="rounded-lg border border-ml-border bg-white p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-ml-ink border-b border-ml-border pb-3 flex items-center gap-2">
              <Target className="text-ml-blue" size={20} />
              Research Scope
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-[11px] text-ml-ink-muted font-bold uppercase tracking-wider">Research Goal</div>
                <div className="text-[15px] text-ml-ink font-medium leading-relaxed mt-1">
                  {project.research_objective}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-ml-ink-muted font-bold uppercase tracking-wider">Study Methodology</div>
                <div className="text-[15px] font-bold text-ml-ink mt-1">
                  {project.study_type}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={() => window.location.hash = `/projects/${project.id}/edit`}
              className="flex items-center justify-center gap-1.5 py-3 px-4 border border-ml-border hover:bg-ml-surface text-ml-ink font-bold rounded-lg transition-colors cursor-pointer"
            >
              <Edit size={16} />
              Edit details
            </button>
            <button
              onClick={onNavigateToPersonas}
              className="group flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-ml-blue hover:bg-ml-blue-strong text-white font-bold rounded-lg transition-colors duration-150 shadow-xs cursor-pointer"
            >
              Go to Persona Catalog
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-150" />
            </button>
          </div>
        </div>
      </div>

      {/* Synthetic Research Warning */}
      <div className="rounded-lg border border-ml-warning/30 bg-amber-50/50 p-5 flex items-start gap-4">
        <div className="p-2 rounded-md bg-amber-100 text-ml-warning mt-0.5 border border-ml-warning/20">
          <ShieldAlert size={20} />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-ml-warning uppercase tracking-wider">Synthetic Research Positioning</h3>
          <p className="text-xs text-ml-ink-muted leading-relaxed font-medium">
            The details shown are synthetic working assumptions generated to simulate target customer behaviors. These personas and metrics serve as simulated research context for PoC evaluation and must be validated with real-world human customer research before finalizing product launch or marketing plans.
          </p>
        </div>
      </div>
    </div>
  );
};
