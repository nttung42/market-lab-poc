import React, { useState, useEffect } from 'react';
import { getStudyResults, getStudy } from '../api/client';
import type { StudyResults, Study } from '../types';
import { 
  BarChart3, 
  ArrowRight, 
  Loader2, 
  MessageSquare, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp, 
  BadgeAlert,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface ResultsDashboardProps {
  studyId: string;
  onNavigateToReports: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  studyId,
  onNavigateToReports,
}) => {
  const [study, setStudy] = useState<Study | null>(null);
  const [results, setResults] = useState<StudyResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'quantitative' | 'qualitative' | 'recommendations'>('quantitative');

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getStudy(studyId),
      getStudyResults(studyId)
    ])
      .then(([studyData, resultsData]) => {
        setStudy(studyData);
        setResults(resultsData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load study results', err);
        setError('No completed study results found. Please configure a study in the Study Builder and click "Run Study" first.');
        setLoading(false);
      });
  }, [studyId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24">
        <Loader2 size={36} className="text-ml-blue animate-spin mb-4" />
        <p className="text-xs font-semibold text-ml-ink-muted uppercase tracking-widest">Generating Results Dashboard...</p>
      </div>
    );
  }

  if (error || !results || !study) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 bg-ml-warning/10 border border-ml-warning/20 rounded-full flex items-center justify-center text-ml-warning mb-5">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-lg font-bold text-ml-ink uppercase tracking-wider mb-2">No Results Available</h2>
        <p className="text-xs text-ml-ink-muted leading-relaxed mb-6">
          {error || 'This study has not been executed yet. Run a simulated study first to view synthetic dashboard metrics.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-ml-blue hover:bg-ml-blue-strong text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
        >
          Reload Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-6 space-y-6 text-ml-ink">
      
      {/* Header Banner */}
      <div className="rounded-lg border border-ml-border bg-white p-6 border-l-4 border-l-ml-blue shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider text-ml-success bg-emerald-50 border border-ml-success/20 rounded uppercase">
              Completed Simulation
            </span>
            <span className="text-[11px] font-bold text-ml-ink-muted uppercase tracking-wider">Concept Validation Dashboard</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight uppercase">{study.title}</h1>
          <p className="text-xs text-ml-ink-muted font-medium">
            Based on {results.total_respondents} synthetic respondent profiles representing 3 structured target segments.
          </p>
        </div>

        <button
          onClick={onNavigateToReports}
          className="group flex items-center justify-center gap-1.5 py-2.5 px-4 bg-ml-blue hover:bg-ml-blue-strong text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
        >
          View Executive Report
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-ml-border gap-1 bg-white p-1 rounded-lg border">
        <button
          onClick={() => setActiveTab('quantitative')}
          className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${
            activeTab === 'quantitative'
              ? 'bg-ml-blue text-white shadow-xs'
              : 'text-ml-ink-muted hover:text-ml-ink hover:bg-ml-surface/50'
          }`}
        >
          QUANTITATIVE METRICS
        </button>
        <button
          onClick={() => setActiveTab('qualitative')}
          className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${
            activeTab === 'qualitative'
              ? 'bg-ml-blue text-white shadow-xs'
              : 'text-ml-ink-muted hover:text-ml-ink hover:bg-ml-surface/50'
          }`}
        >
          QUALITATIVE INSIGHTS
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${
            activeTab === 'recommendations'
              ? 'bg-ml-blue text-white shadow-xs'
              : 'text-ml-ink-muted hover:text-ml-ink hover:bg-ml-surface/50'
          }`}
        >
          AI RECOMMENDATIONS
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        
        {/* PANEL: QUANTITATIVE */}
        {activeTab === 'quantitative' && (
          <div className="space-y-6">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-ml-border p-5 space-y-2">
                <div className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider">Total Simulated Panel</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black">{results.total_respondents}</span>
                  <span className="text-xs font-semibold text-ml-ink-muted">respondents</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-ml-border p-5 space-y-2">
                <div className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider">Pricing Concern Likert Avg</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-ml-blue">
                    {results.quantitative.find(q => q.question_type === 'likert')?.average_rating || 'N/A'}
                  </span>
                  <span className="text-xs font-semibold text-ml-ink-muted">/ 5.0</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-ml-border p-5 space-y-2">
                <div className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider">Confidence Level</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-ml-success">85%</span>
                  <span className="text-xs font-semibold text-ml-success bg-emerald-50 px-1.5 py-0.5 rounded border border-ml-success/15 uppercase">Stable</span>
                </div>
              </div>
            </div>

            {/* Questions Results Card */}
            <div className="bg-white rounded-lg border border-ml-border p-6 space-y-8">
              <h2 className="text-sm font-black uppercase tracking-wider border-b border-ml-border pb-3 flex items-center gap-2">
                <BarChart3 size={18} className="text-ml-blue" />
                Response Distribution Charts
              </h2>

              <div className="space-y-10">
                {results.quantitative.map((q, idx) => (
                  <div key={q.question_id} className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-ml-blue bg-ml-blue-soft px-2 py-0.5 rounded border border-ml-blue/10 uppercase">
                        Question {idx + 1} • {q.question_type.replace('_', ' ')}
                      </span>
                      <h3 className="text-sm font-extrabold">{q.question_text}</h3>
                    </div>

                    {/* Render Charts */}
                    {q.question_type === 'likert' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
                        {/* Likert Distribution Bar list */}
                        <div className="space-y-2.5">
                          {q.results.map((res) => (
                            <div key={res.option} className="space-y-1">
                              <div className="flex justify-between text-xs font-medium">
                                <span>{res.option}</span>
                                <span className="font-bold text-ml-ink">{res.percentage}% <span className="text-ml-ink-muted">({res.count})</span></span>
                              </div>
                              <div className="w-full h-3 bg-ml-surface rounded-full overflow-hidden border border-ml-border/60">
                                <div 
                                  className="h-full bg-ml-blue rounded-full transition-all duration-500"
                                  style={{ width: `${res.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Likert Statistics */}
                        <div className="p-6 bg-ml-surface/40 rounded-lg border border-ml-border flex flex-col items-center justify-center text-center space-y-2">
                          <TrendingUp size={28} className="text-ml-blue" />
                          <div className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider">Average Cohort Rating</div>
                          <div className="text-4xl font-black">{q.average_rating}</div>
                          <p className="text-xs text-ml-ink-muted font-medium max-w-xs">
                            An average score above 4.0 indicates that pricing and value transparency are key factors for this target group.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3.5 pt-2 max-w-3xl">
                        {/* Standard Horizontal Bars */}
                        {q.results.map((res) => (
                          <div key={res.option} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span>{res.option}</span>
                              <span className="font-bold text-ml-ink">{res.percentage}% <span className="text-ml-ink-muted">({res.count})</span></span>
                            </div>
                            <div className="w-full h-4 bg-ml-surface rounded-full overflow-hidden border border-ml-border/60">
                              <div 
                                className="h-full bg-ml-blue rounded-full transition-all duration-500"
                                style={{ width: `${res.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* PANEL: QUALITATIVE */}
        {activeTab === 'qualitative' && (
          <div className="space-y-6">
            
            {/* Persona Cohorts Quotes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.qualitative_themes.map((theme, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-ml-border p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="px-2 py-0.5 text-[10px] font-bold text-ml-blue bg-ml-blue-soft border border-ml-blue/15 rounded uppercase">
                      Cohort Segment {idx + 1}
                    </span>
                    <h3 className="text-sm font-extrabold uppercase tracking-wide">{theme.theme}</h3>
                    <p className="text-xs text-ml-ink-muted leading-relaxed font-medium">
                      {theme.description}
                    </p>
                  </div>

                  {/* Sample Quote inside the card */}
                  {theme.quotes && theme.quotes.length > 0 && (
                    <div className="p-4 bg-ml-surface/40 rounded border border-ml-border/60 font-medium italic text-xs text-ml-ink leading-relaxed">
                      {theme.quotes[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Objections Dashboard block */}
            <div className="bg-white rounded-lg border border-ml-border p-6 space-y-6">
              <h2 className="text-sm font-black uppercase tracking-wider border-b border-ml-border pb-3 flex items-center gap-2">
                <MessageSquare size={18} className="text-ml-blue" />
                Objections & Friction Points
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.qualitative_themes.map((theme, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-ml-ink-muted border-l-2 border-l-ml-blue pl-2">
                      {theme.theme.split('&')[0].trim()}
                    </div>
                    <ul className="space-y-2 text-xs font-medium text-ml-ink leading-relaxed pl-1">
                      {theme.objections.map((obj, oIdx) => (
                        <li key={oIdx} className="flex gap-2 items-start">
                          <span className="text-ml-danger shrink-0 mt-0.5">✕</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Quotes Gallery */}
            <div className="bg-white rounded-lg border border-ml-border p-6 space-y-6">
              <h2 className="text-sm font-black uppercase tracking-wider border-b border-ml-border pb-3">
                Verbatim Synthetic Responses
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.qualitative_themes.flatMap((t, tIdx) => 
                  t.quotes.map((q, qIdx) => (
                    <div key={`${tIdx}-${qIdx}`} className="p-4 bg-ml-surface/20 rounded border border-ml-border/60 text-xs font-medium leading-relaxed italic text-ml-ink-muted relative">
                      <span className="absolute top-2 right-3 text-[10px] text-ml-blue font-bold uppercase tracking-widest">{t.theme.split('&')[0].trim().split(' ')[0]}</span>
                      {q}
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* PANEL: RECOMMENDATIONS */}
        {activeTab === 'recommendations' && (
          <div className="bg-white rounded-lg border border-ml-border p-6 space-y-6">
            <div className="border-b border-ml-border pb-3 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={18} className="text-ml-blue" fill="currentColor" />
                Actionable AI Strategy Recommendations
              </h2>
              <span className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider">Simulated Insight Summary</span>
            </div>

            <div className="divide-y divide-ml-border/60">
              {results.recommendations.map((rec, idx) => (
                <div key={idx} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start gap-4">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                    rec.priority === 'High' 
                      ? 'bg-red-50 text-ml-danger border border-ml-danger/20' 
                      : 'bg-amber-50 text-ml-warning border border-ml-warning/20'
                  }`}>
                    {rec.priority} Priority
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-ml-ink flex items-center gap-1.5">
                      <ChevronRight size={14} className="text-ml-blue" />
                      {rec.title}
                    </h3>
                    <p className="text-xs text-ml-ink-muted leading-relaxed font-medium pl-5">
                      {rec.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Synthetic Research Warning */}
      <div className="rounded-lg border border-ml-warning/30 bg-amber-50/50 p-5 flex items-start gap-4">
        <div className="p-2 rounded-md bg-amber-100 text-ml-warning mt-0.5 border border-ml-warning/20">
          <BadgeAlert size={20} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-ml-warning uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={14} />
            Synthetic Output Calibration Warning
          </h3>
          <p className="text-[11px] text-ml-ink-muted leading-relaxed font-medium">
            The results shown represent simulated responses synthesized using AI models of student behavior segments (Minh Thu, Nam, Khanh Vy). Objections and recommendations are logical conclusions calculated under specific prompt constraints. These metrics are designed to help validate early hypothesis positioning and must be confirmed by real-world human customer surveys before making heavy marketing or product investments.
          </p>
        </div>
      </div>

    </div>
  );
};
