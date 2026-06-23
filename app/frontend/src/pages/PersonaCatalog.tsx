import React, { useEffect, useState } from 'react';
import type { Persona } from '../types';
import { getProjectPersonas } from '../api/client';
import { ShieldAlert, Quote, CheckCircle2, AlertTriangle, Lightbulb, Compass, Award } from 'lucide-react';

interface PersonaCatalogProps {
  projectId: string;
}

export const PersonaCatalog: React.FC<PersonaCatalogProps> = ({ projectId }) => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProjectPersonas(projectId)
      .then((data) => {
        setPersonas(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Failed to load personas.');
        setLoading(false);
      });
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 animate-pulse">
        <div className="h-8 bg-ml-border rounded w-1/3 mb-10"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-[600px] bg-ml-border rounded-lg"></div>
          <div className="h-[600px] bg-ml-border rounded-lg"></div>
          <div className="h-[600px] bg-ml-border rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto px-6 py-12 text-center">
        <div className="w-16 h-16 bg-ml-danger/10 border border-ml-danger/30 rounded-full flex items-center justify-center text-ml-danger mb-4">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-xl font-bold text-ml-ink mb-2">Failed to Load Personas</h2>
        <p className="text-sm text-ml-ink-muted mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-ml-blue hover:bg-ml-blue-strong text-white font-bold rounded-lg transition-colors duration-150 cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8 text-ml-ink">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-ml-border">
        <div>
          <h1 className="text-[24px] md:text-[30px] font-black tracking-tight text-ml-ink uppercase">
            Synthetic Persona Catalog
          </h1>
          <p className="text-sm text-ml-ink-muted mt-1 font-medium">
            Target buyer personas generated for simulations and messaging tests.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ml-blue-soft border border-ml-border text-ml-blue-strong text-xs font-bold w-fit">
          <Compass size={14} className="animate-spin-slow" />
          3 PERSONAS PROFILED
        </div>
      </div>

      {/* Limitation Notice */}
      <div className="rounded-lg border border-ml-warning/30 bg-amber-50/50 p-5 flex items-start gap-4">
        <div className="p-2 rounded-md bg-amber-100 text-ml-warning mt-0.5 border border-ml-warning/20">
          <ShieldAlert size={20} />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-ml-warning uppercase tracking-wider">Persona Simulation Disclaimer</h3>
          <p className="text-xs text-ml-ink-muted leading-relaxed font-medium">
            These personas represent modeled synthetic segments. Their quote, objections, and buying criteria are built based on simulation parameters for this project. They serve as simulated research assets and require physical human research validation before committing budget to product launch or pricing strategies.
          </p>
        </div>
      </div>

      {/* Persona Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {personas.map((persona) => {
          // Subtle light tints for card header to keep a premium visual differentiation
          let cardHeaderBg = 'bg-emerald-50/50';
          let badgeBg = 'bg-emerald-50 text-ml-success border-emerald-200';
          let progressBg = 'bg-ml-success';

          if (persona.id === 'persona-career-focused') {
            cardHeaderBg = 'bg-ml-blue-soft/30';
            badgeBg = 'bg-ml-blue-soft text-ml-blue-strong border-ml-blue/20';
            progressBg = 'bg-ml-blue';
          } else if (persona.id === 'persona-casual-learner') {
            cardHeaderBg = 'bg-amber-50/50';
            badgeBg = 'bg-amber-50 text-ml-warning border-amber-200';
            progressBg = 'bg-ml-warning';
          }

          return (
            <div
              key={persona.id}
              className="flex flex-col rounded-lg border border-ml-border bg-white shadow-xs overflow-hidden transition-all duration-200 hover:border-ml-blue/30 hover:shadow-md"
            >
              {/* Card Header Banner */}
              <div className={`p-6 ${cardHeaderBg} border-b border-ml-border`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border uppercase ${badgeBg}`}>
                    {persona.segment}
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] text-ml-ink-muted font-bold flex items-center gap-1 uppercase tracking-wider">
                      <Award size={12} />
                      Confidence
                    </span>
                    <span className="text-sm font-black text-ml-ink">{persona.confidence_score}%</span>
                    <div className="w-16 h-1 bg-ml-border rounded-full mt-1 overflow-hidden">
                      <div className={`h-full ${progressBg}`} style={{ width: `${persona.confidence_score}%` }}></div>
                    </div>
                  </div>
                </div>

                <h2 className="text-[20px] font-black text-ml-ink tracking-tight uppercase leading-tight">{persona.name}</h2>
                
                {/* Demographics list */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {persona.demographics.map((demo, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 bg-white border border-ml-border rounded text-ml-ink-muted font-bold uppercase">
                      {demo}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className="p-5 border-b border-ml-border/50 bg-ml-surface/30 flex gap-2">
                <Quote size={20} className="text-ml-blue shrink-0 mt-0.5" />
                <p className="text-xs italic text-ml-ink-muted leading-relaxed font-semibold">
                  "{persona.quote}"
                </p>
              </div>

              {/* Card Body - Structured Attributes */}
              <div className="p-6 flex-1 space-y-5 overflow-y-auto max-h-[450px]">
                {/* Goals */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-ml-success uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-ml-success" />
                    Key Goals
                  </h3>
                  <ul className="space-y-1">
                    {persona.goals.map((g, idx) => (
                      <li key={idx} className="text-xs text-ml-ink font-medium leading-relaxed pl-3 relative before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:bg-ml-success before:rounded-full">
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pain Points */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-ml-danger uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle size={13} className="text-ml-danger" />
                    Pain Points
                  </h3>
                  <ul className="space-y-1">
                    {persona.pain_points.map((p, idx) => (
                      <li key={idx} className="text-xs text-ml-ink font-medium leading-relaxed pl-3 relative before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:bg-ml-danger before:rounded-full">
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Objections */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-ml-warning uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert size={13} className="text-ml-warning" />
                    Primary Objections
                  </h3>
                  <ul className="space-y-1">
                    {persona.objections.map((o, idx) => (
                      <li key={idx} className="text-xs text-ml-ink font-medium leading-relaxed pl-3 relative before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:bg-ml-warning before:rounded-full">
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Decision Rules */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-ml-ink uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb size={13} className="text-ml-blue" />
                    Decision Rules
                  </h3>
                  <ul className="space-y-1">
                    {persona.decision_rules.map((r, idx) => (
                      <li key={idx} className="text-xs text-ml-ink font-medium leading-relaxed pl-3 relative before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:bg-ml-ink before:rounded-full">
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Assumptions */}
                <div className="space-y-2 border-t border-ml-border pt-3">
                  <h3 className="text-[11px] font-bold text-ml-ink-muted uppercase tracking-wider mb-2">
                    Synthetic Assumptions
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {persona.assumptions.map((a, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 bg-ml-blue-soft border border-ml-blue/15 rounded text-ml-blue-strong font-bold">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
