import React, { useEffect, useState } from 'react';
import type { Project } from '../types';
import { getProject } from '../api/client';
import { BookOpen, MapPin, Users, Target, Activity, ArrowRight, ShieldAlert } from 'lucide-react';

interface ProjectOverviewProps {
  projectId: string;
  onNavigateToPersonas: () => void;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  projectId,
  onNavigateToPersonas,
}) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProject(projectId)
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Failed to load project details.');
        setLoading(false);
      });
  }, [projectId]);

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
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-ml-blue hover:bg-ml-blue-strong text-white font-bold rounded-lg transition-colors duration-150"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-8 text-ml-ink">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg border border-ml-border bg-white p-8 md:p-12 border-l-4 border-l-ml-blue shadow-xs">
        <div className="relative space-y-4 max-w-3xl">
          <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider text-ml-blue bg-ml-blue-soft border border-ml-blue/20 rounded-full uppercase">
            Active Workspace
          </span>
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

          <button
            onClick={onNavigateToPersonas}
            className="group mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 bg-ml-blue hover:bg-ml-blue-strong text-white font-bold rounded-lg transition-colors duration-150 shadow-xs cursor-pointer"
          >
            Go to Persona Catalog
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-150" />
          </button>
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
            The details shown are synthetic working assumptions generated to simulate target student behaviors. These personas and metrics serve as simulated research context for PoC evaluation and must be validated with real-world human customer research before finalizing product launch or marketing plans.
          </p>
        </div>
      </div>
    </div>
  );
};
