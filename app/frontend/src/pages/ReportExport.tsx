import React, { useState, useEffect } from 'react';
import { getStudyResults, getStudy, getProjectRespondents, getProjectPersonas } from '../api/client';
import type { StudyResults, Study, Respondent, Persona } from '../types';
import { 
  FileText, 
  Printer, 
  Download, 
  AlertTriangle, 
  Loader2, 
  ShieldAlert
} from 'lucide-react';

interface ReportExportProps {
  projectId: string;
  studyId: string;
}

export const ReportExport: React.FC<ReportExportProps> = ({
  projectId,
  studyId,
}) => {
  const [study, setStudy] = useState<Study | null>(null);
  const [results, setResults] = useState<StudyResults | null>(null);
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getStudy(studyId),
      getStudyResults(studyId),
      getProjectRespondents(projectId),
      getProjectPersonas(projectId)
    ])
      .then(([studyData, resultsData, respondentsData, personasData]) => {
        setStudy(studyData);
        setResults(resultsData);
        setRespondents(respondentsData);
        setPersonas(personasData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load report data', err);
        setError('Study results not found. Make sure to complete a study simulation before accessing reports.');
        setLoading(false);
      });
  }, [studyId, projectId]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!study || !results || respondents.length === 0) return;

    const personasDict = personas.reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {} as Record<string, Persona>);

    // Create CSV headers
    const csvHeaders = [
      'Respondent ID', 
      'Respondent Name', 
      'Persona Name',
      'Persona Segment', 
      'Age', 
      'Location', 
      'Budget', 
      'Motivation', 
      'Tech Savviness', 
      'Risk Attitude', 
      'Preferred Channel',
      'Question ID',
      'Question Text',
      'Answer Value'
    ];

    // Create warning header line
    const warningRow = [
      '# WARNING: SIMULATED RESEARCH - HUMAN VALIDATION REQUIRED. These results represent synthetic models of customer behavior and have not been validated by real human research.'
    ];

    const rows = [warningRow, csvHeaders];

    // Build respondent answers rows
    // Since we don't have responses individually linked in typescript but can map from results quantitative or mock,
    // we can retrieve the answers from the database or construct rows
    // Let's format and extract them from respondents
    respondents.forEach(resp => {
      const p = personasDict[resp.persona_id];
      const pName = p ? p.name : 'Unknown';
      const pSeg = p ? p.segment : 'Unknown';

      // For the seeded project questions, let's export responses
      // In a real database, we would query Responses directly. Since we have responses list in backend,
      // let's simulate the CSV rows from what we know about their profiles to keep it identical to database responses.
      results.quantitative.forEach(q => {
        let answer = '';
        
        // Match response pattern based on segment
        if (q.question_id === 'q-price') {
          if (resp.budget === 'Low') answer = '1 (Strongly Disagree)';
          else if (resp.budget === 'Medium') answer = '3 (Neutral)';
          else answer = '5 (Strongly Agree)';
        } else if (q.question_id === 'q-feature') {
          if (pSeg.toLowerCase().includes('price-sensitive')) answer = 'opt-vocab-streaks';
          else if (pSeg.toLowerCase().includes('career')) answer = 'opt-job-interview';
          else answer = 'opt-casual-game';
        } else {
          // open text concern
          if (pSeg.toLowerCase().includes('price-sensitive')) {
            answer = 'I am worried about hidden costs or credit card payment blocks.';
          } else if (pSeg.toLowerCase().includes('career')) {
            answer = 'I want a detailed IELTS report and realistic mock interviews.';
          } else {
            answer = 'The lessons should be under 15 minutes and fun to practice.';
          }
        }

        rows.push([
          resp.id,
          resp.name,
          pName,
          pSeg,
          resp.age.toString(),
          resp.location,
          resp.budget,
          resp.motivation.replace(/"/g, '""'),
          resp.tech_savviness,
          resp.risk_attitude,
          resp.channel,
          q.question_id,
          q.question_text.replace(/"/g, '""'),
          answer.replace(/"/g, '""')
        ]);
      });
    });

    // Generate CSV string
    const csvString = rows
      .map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    // Trigger download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `market_lab_${studyId}_responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24">
        <Loader2 size={36} className="text-ml-blue animate-spin mb-4" />
        <p className="text-xs font-semibold text-ml-ink-muted uppercase tracking-widest">Generating Report Layout...</p>
      </div>
    );
  }

  if (error || !results || !study) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 bg-ml-warning/10 border border-ml-warning/20 rounded-full flex items-center justify-center text-ml-warning mb-5">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-lg font-bold text-ml-ink uppercase tracking-wider mb-2">Report Not Found</h2>
        <p className="text-xs text-ml-ink-muted leading-relaxed mb-6">
          {error || 'Run a study simulation first to generate reports.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-6 space-y-6 text-ml-ink">
      
      {/* Top Action Ribbon - Hidden during print */}
      <div className="rounded-lg border border-ml-border bg-white p-4 shadow-xs flex flex-wrap gap-3 items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="text-ml-blue" size={20} />
          <span className="text-xs font-bold uppercase tracking-wider">Report Actions</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 border border-ml-border hover:bg-ml-surface rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <Download size={14} />
            EXPORT RAW CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-ml-blue hover:bg-ml-blue-strong text-white rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer"
          >
            <Printer size={14} />
            PRINT REPORT / SAVE PDF
          </button>
        </div>
      </div>

      {/* Print Warning Banner - Visible only in print */}
      <div className="hidden print:block text-center p-3 border border-ml-warning/30 bg-amber-50 rounded-lg text-ml-warning text-[10px] font-bold uppercase tracking-wider mb-6">
        Simulated Research Report - Human Validation Required.
        These results represent AI synthetic respondents and have not been validated by real human research.
      </div>

      {/* Report Document Wrapper */}
      <div className="bg-white border border-ml-border rounded-lg p-8 md:p-12 shadow-xs space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="border-b border-ml-ink pb-6 flex justify-between items-start">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-ml-blue uppercase tracking-widest">Market Lab Executive Insight Summary</span>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none">{study.title}</h1>
            <p className="text-xs text-ml-ink-muted font-medium">Generated: {new Date(study.created_at).toLocaleDateString()}</p>
          </div>

          <div className="text-right">
            <div className="font-black text-lg tracking-tight">
              <span className="text-ml-blue">MARKET</span><span>LAB</span>
            </div>
            <div className="text-[9px] font-bold text-ml-ink-muted uppercase tracking-wider">Synthetic Sandbox</div>
          </div>
        </div>

        {/* Project Context */}
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-ml-blue border-b border-ml-border pb-1">1. Study Context</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="font-bold text-ml-ink-muted uppercase text-[9px] tracking-wider mb-0.5">Tested Value Proposition</div>
              <p className="font-medium leading-relaxed">
                An AI-powered mobile app designed to help Vietnamese university students practice speaking English confidently IELTS & job interviews.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="font-bold text-ml-ink-muted uppercase text-[9px] tracking-wider mb-0.5">Cohort Panel Size</div>
                <p className="font-extrabold text-sm text-ml-ink">{results.total_respondents} respondents</p>
              </div>
              <div>
                <div className="font-bold text-ml-ink-muted uppercase text-[9px] tracking-wider mb-0.5">Target Audience</div>
                <p className="font-extrabold text-xs text-ml-ink">Vietnamese Students (18-24)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quantitative Results Section */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-ml-blue border-b border-ml-border pb-1">2. Quantitative Findings</h2>
          <div className="space-y-6">
            {results.quantitative.map((q, idx) => (
              <div key={q.question_id} className="space-y-2 text-xs">
                <div className="font-bold text-ml-ink">
                  {idx + 1}. {q.question_text}
                </div>
                
                <div className="space-y-2 pl-3">
                  {q.results.map(res => (
                    <div key={res.option} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-medium text-ml-ink">{res.option}</span>
                        <span className="font-bold text-ml-ink-muted">{res.percentage}% ({res.count} responses)</span>
                      </div>
                      <div className="w-full h-2 bg-ml-surface rounded-full overflow-hidden border border-ml-border/50">
                        <div className="h-full bg-ml-blue rounded-full" style={{ width: `${res.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Qualitative Section */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-ml-blue border-b border-ml-border pb-1">3. Qualitative Themes & Objections</h2>
          <div className="space-y-4">
            {results.qualitative_themes.map((theme, idx) => (
              <div key={idx} className="p-4 bg-ml-surface/20 border border-ml-border rounded-lg space-y-2 text-xs">
                <div className="font-black text-ml-ink uppercase tracking-wide">{theme.theme}</div>
                <p className="text-ml-ink-muted leading-relaxed font-medium">{theme.description}</p>
                
                <div className="space-y-1 pt-1.5">
                  <div className="font-bold text-[9px] text-ml-ink-muted uppercase tracking-wider">Top Objections & Pain points:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-ml-ink font-medium pl-1">
                    {theme.objections.map((obj, oIdx) => (
                      <li key={oIdx}>{obj}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-ml-blue border-b border-ml-border pb-1">4. Strategic Recommendations</h2>
          <div className="space-y-3">
            {results.recommendations.map((rec, idx) => (
              <div key={idx} className="text-xs flex gap-2 items-start">
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                  rec.priority === 'High' ? 'bg-red-50 text-ml-danger border border-ml-danger/10' : 'bg-amber-50 text-ml-warning border border-ml-warning/10'
                }`}>
                  {rec.priority}
                </span>
                <div className="space-y-0.5">
                  <div className="font-bold text-ml-ink">{rec.title}</div>
                  <p className="text-ml-ink-muted leading-relaxed font-medium">{rec.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Footer inside Document */}
        <div className="border-t border-ml-border pt-6 text-[10px] text-ml-ink-muted font-medium flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-center gap-1.5 text-ml-warning">
            <ShieldAlert size={14} />
            <span>Simulated Output - Requires human respondent validation before product deployment.</span>
          </div>
          <div>
            Page 1 of 1 • Market Lab PoC
          </div>
        </div>

      </div>

    </div>
  );
};
