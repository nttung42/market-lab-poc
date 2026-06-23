import React, { useState, useEffect } from 'react';
import { getProjectStudies, createStudy, addQuestion, runStudy, getProjectPersonas, updateStudy, deleteStudy } from '../api/client';
import type { Study, Persona } from '../types';
import { 
  ClipboardList, 
  Plus, 
  Play, 
  Sparkles, 
  Trash2, 
  Loader2, 
  HelpCircle,
  AlertTriangle,
  Edit,
  Check,
  X
} from 'lucide-react';

interface StudyBuilderProps {
  projectId: string;
  onNavigateToResults: (studyId: string) => void;
}

interface NewQuestionState {
  text: string;
  type: 'single_choice' | 'multi_choice' | 'likert' | 'open_text';
  options: string[];
}

export const StudyBuilder: React.FC<StudyBuilderProps> = ({
  projectId,
  onNavigateToResults,
}) => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [activeStudy, setActiveStudy] = useState<Study | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
  
  // Form State
  const [newStudyTitle, setNewStudyTitle] = useState('');
  const [newQuestion, setNewQuestion] = useState<NewQuestionState>({
    text: '',
    type: 'single_choice',
    options: ['', ''],
  });

  // Loading & Progress States
  const [loading, setLoading] = useState(true);
  const [savingStudy, setSavingStudy] = useState(false);
  const [runningSim, setRunningSim] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [simStatusText, setSimStatusText] = useState('');

  // Study Rename & Delete State
  const [isEditingStudyTitle, setIsEditingStudyTitle] = useState(false);
  const [editedStudyTitle, setEditedStudyTitle] = useState('');

  const handleDeleteActiveStudy = async () => {
    if (!activeStudy) return;
    if (!confirm(`Are you sure you want to delete the study "${activeStudy.title}"? This will permanently delete all simulated responses.`)) {
      return;
    }
    
    setLoading(true);
    try {
      await deleteStudy(activeStudy.id);
      const list = studies.filter(s => s.id !== activeStudy.id);
      setStudies(list);
      setActiveStudy(list[0] || null);
    } catch (err) {
      console.error('Failed to delete study', err);
      alert('Failed to delete study.');
    } finally {
      setLoading(false);
    }
  };

  const handleRenameActiveStudy = async () => {
    if (!activeStudy || !editedStudyTitle.trim()) return;
    try {
      const updated = await updateStudy(activeStudy.id, editedStudyTitle.trim());
      setStudies(prev => prev.map(s => s.id === activeStudy.id ? { ...s, title: updated.title } : s));
      setActiveStudy(prev => prev ? { ...prev, title: updated.title } : null);
      setIsEditingStudyTitle(false);
    } catch (err) {
      console.error('Failed to rename study', err);
      alert('Failed to rename study.');
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [projectId]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [studiesData, personasData] = await Promise.all([
        getProjectStudies(projectId),
        getProjectPersonas(projectId)
      ]);
      setStudies(studiesData);
      setPersonas(personasData);
      setSelectedPersonas(personasData.map(p => p.id)); // select all by default

      // Default to completed seeded study if it exists, or the first draft
      const completed = studiesData.find(s => s.status === 'completed');
      const draft = studiesData.find(s => s.status === 'draft');
      setActiveStudy(completed || draft || studiesData[0] || null);
    } catch (err) {
      console.error('Failed to load initial data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudyTitle.trim()) return;
    
    setSavingStudy(true);
    try {
      const study = await createStudy(projectId, newStudyTitle);
      setStudies(prev => [study, ...prev]);
      setActiveStudy(study);
      setNewStudyTitle('');
    } catch (err) {
      console.error('Failed to create study', err);
    } finally {
      setSavingStudy(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!activeStudy || !newQuestion.text.trim()) return;

    const questionId = `q-${Date.now()}`;
    const formattedOptions = newQuestion.type === 'single_choice' || newQuestion.type === 'multi_choice'
      ? newQuestion.options
          .filter(opt => opt.trim() !== '')
          .map((opt, idx) => ({
            id: `opt-${idx}-${Date.now()}`,
            text: opt,
            value: opt.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          }))
      : [];

    const questionData = {
      id: questionId,
      text: newQuestion.text,
      type: newQuestion.type,
      position: (activeStudy.questions?.length || 0) + 1,
      options: formattedOptions
    };

    try {
      await addQuestion(activeStudy.id, questionData);
      // Reload active study from backend to get refreshed questions list
      loadInitialData();
      // Reset question form
      setNewQuestion({
        text: '',
        type: 'single_choice',
        options: ['', ''],
      });
    } catch (err) {
      console.error('Failed to add question', err);
    }
  };

  const handleRunSimulation = async () => {
    if (!activeStudy) return;
    setRunningSim(true);
    setSimProgress(5);
    setSimStatusText('Initializing synthetic panel...');

    // Visual simulator progress interval
    const interval = setInterval(() => {
      setSimProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        const step = Math.random() > 0.5 ? 15 : 5;
        // Update messages based on progress
        if (prev > 70) setSimStatusText('Aggregating insights and recommendations...');
        else if (prev > 40) setSimStatusText('Simulating respondent decision rules...');
        else if (prev > 20) setSimStatusText('Simulating cohort preferences...');
        return prev + step;
      });
    }, 400);

    try {
      await runStudy(activeStudy.id, selectedPersonas);
      clearInterval(interval);
      setSimProgress(100);
      setSimStatusText('Simulation complete!');
      setTimeout(() => {
        setRunningSim(false);
        onNavigateToResults(activeStudy.id);
      }, 1000);
    } catch (err) {
      clearInterval(interval);
      setRunningSim(false);
      alert('Simulation failed. Please verify that respondents have been generated first.');
    }
  };

  const addOptionField = () => {
    setNewQuestion(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOptionField = (idx: number) => {
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== idx)
    }));
  };

  const handleOptionChange = (idx: number, value: string) => {
    setNewQuestion(prev => {
      const opts = [...prev.options];
      opts[idx] = value;
      return { ...prev, options: opts };
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24">
        <Loader2 size={36} className="text-ml-blue animate-spin mb-4" />
        <p className="text-xs font-semibold text-ml-ink-muted uppercase tracking-widest">Loading Study Builder...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-6 space-y-6 text-ml-ink">
      
      {/* Simulation Overlay Progress Monitor */}
      {runningSim && (
        <div className="fixed inset-0 bg-ml-ink/80 backdrop-blur-xs flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg border border-ml-border max-w-md w-full p-8 text-center space-y-6 shadow-xl">
            <div className="w-16 h-16 bg-ml-blue-soft text-ml-blue rounded-full flex items-center justify-center mx-auto">
              <Loader2 size={32} className="animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold uppercase tracking-wide">Synthetic Study Run</h3>
              <p className="text-sm font-semibold text-ml-blue">{simStatusText}</p>
            </div>
            <div className="space-y-1">
              <div className="w-full h-3 bg-ml-surface rounded-full overflow-hidden border border-ml-border">
                <div 
                  className="h-full bg-ml-blue transition-all duration-300 ease-out"
                  style={{ width: `${simProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-ml-ink-muted font-bold">
                <span>0%</span>
                <span>{simProgress}%</span>
                <span>100%</span>
              </div>
            </div>
            <div className="p-4 bg-ml-surface rounded border border-ml-border text-left">
              <div className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider mb-1">Execution Log</div>
              <div className="text-[11px] font-mono text-ml-ink leading-relaxed space-y-0.5 max-h-24 overflow-y-auto">
                <div className="text-ml-success">✔ Initialized study simulation</div>
                <div>✔ Fetched {selectedPersonas.length} target personas</div>
                <div>✔ Found 15 synthetic respondents</div>
                {simProgress > 20 && <div>▶ Prompting virtual panels...</div>}
                {simProgress > 50 && <div className="text-ml-success">✔ Saved simulated responses</div>}
                {simProgress > 80 && <div>▶ Extracting results and summaries...</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="rounded-lg border border-ml-border bg-white p-6 border-l-4 border-l-ml-blue shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider text-white bg-ml-blue rounded uppercase">
              Phase 1 MVP
            </span>
            <span className="text-[11px] font-bold text-ml-ink-muted uppercase tracking-wider">Campaign Discovery</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight uppercase">Study Builder</h1>
          <p className="text-xs text-ml-ink-muted font-medium">
            Design surveys and run concepts tests against synthetic cohorts.
          </p>
        </div>

        {/* Study Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {isEditingStudyTitle ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={editedStudyTitle}
                onChange={(e) => setEditedStudyTitle(e.target.value)}
                className="border border-ml-border px-3 py-1.5 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-ml-blue bg-white"
              />
              <button
                onClick={handleRenameActiveStudy}
                className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg transition-colors cursor-pointer"
                title="Save Title"
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => setIsEditingStudyTitle(false)}
                className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer"
                title="Cancel"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <select
                  value={activeStudy?.id || ''}
                  onChange={(e) => setActiveStudy(studies.find(s => s.id === e.target.value) || null)}
                  className="bg-white border border-ml-border px-4 py-2 rounded-lg text-xs font-bold text-ml-ink focus:outline-none focus:ring-1 focus:ring-ml-blue pr-8 appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Study...</option>
                  {studies.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.status.toUpperCase()})
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ml-ink-muted text-xs">▼</div>
              </div>
              {activeStudy && (
                <>
                  <button
                    onClick={() => {
                      setEditedStudyTitle(activeStudy.title);
                      setIsEditingStudyTitle(true);
                    }}
                    className="p-2 border border-ml-border hover:bg-ml-surface text-ml-ink-muted hover:text-ml-blue rounded-lg transition-colors cursor-pointer"
                    title="Rename Study"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={handleDeleteActiveStudy}
                    className="p-2 border border-ml-border hover:bg-ml-surface text-ml-ink-muted hover:text-ml-danger rounded-lg transition-colors cursor-pointer"
                    title="Delete Study"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          )}

          <form onSubmit={handleCreateStudy} className="flex gap-1.5">
            <input
              type="text"
              placeholder="New Study Title..."
              value={newStudyTitle}
              onChange={(e) => setNewStudyTitle(e.target.value)}
              className="border border-ml-border px-3 py-2 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ml-blue bg-white w-full sm:w-44"
            />
            <button
              type="submit"
              disabled={savingStudy || !newStudyTitle.trim()}
              className="px-3 py-2 bg-ml-ink hover:bg-ml-ink-muted disabled:bg-ml-border text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              {savingStudy ? <Loader2 size={12} className="animate-spin" /> : <Plus size={14} />}
              CREATE
            </button>
          </form>
        </div>
      </div>

      {activeStudy ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main Question Config Block */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* List of Existing Questions */}
            <div className="bg-white rounded-lg border border-ml-border p-6 space-y-6">
              <h2 className="text-sm font-black uppercase tracking-wider border-b border-ml-border pb-3 flex items-center gap-2">
                <ClipboardList size={18} className="text-ml-blue" />
                Study Questions ({activeStudy.questions?.length || 0})
              </h2>

              {activeStudy.questions && activeStudy.questions.length > 0 ? (
                <div className="space-y-4">
                  {activeStudy.questions
                    .sort((a, b) => a.position - b.position)
                    .map((q, idx) => (
                      <div key={q.id} className="p-4 bg-ml-surface/40 border border-ml-border rounded-lg space-y-3 relative group">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-ml-blue bg-ml-blue-soft px-2 py-0.5 rounded border border-ml-blue/10 uppercase">
                              Question {idx + 1} • {q.type.replace('_', ' ')}
                            </span>
                            <h3 className="text-sm font-bold leading-relaxed">{q.text}</h3>
                          </div>
                        </div>

                        {/* Options display */}
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {q.options.map(opt => (
                              <div key={opt.id} className="px-3 py-1.5 bg-white border border-ml-border/60 rounded text-xs text-ml-ink-muted font-medium">
                                <span className="font-bold text-ml-ink mr-1">{opt.value.toUpperCase()}:</span> {opt.text}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12 text-ml-ink-muted border border-dashed border-ml-border rounded-lg bg-ml-surface/20 space-y-2">
                  <HelpCircle size={28} className="mx-auto text-ml-border" />
                  <p className="text-xs font-bold uppercase tracking-wider">No Questions Added Yet</p>
                  <p className="text-xs text-ml-ink-muted max-w-xs mx-auto">Use the panel below to build and add your first concept survey question.</p>
                </div>
              )}
            </div>

            {/* Create New Question Panel */}
            <div className="bg-white rounded-lg border border-ml-border p-6 space-y-5">
              <h2 className="text-sm font-black uppercase tracking-wider border-b border-ml-border pb-3 flex items-center gap-2">
                <Plus size={18} className="text-ml-blue" />
                Add Question
              </h2>

              <div className="space-y-4">
                {/* Question Type */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-1">
                    <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block mb-1">Question Type</label>
                    <select
                      value={newQuestion.type}
                      onChange={(e) => setNewQuestion(prev => ({ 
                        ...prev, 
                        type: e.target.value as any, 
                        options: e.target.value === 'single_choice' || e.target.value === 'multi_choice' ? ['', ''] : [] 
                      }))}
                      className="w-full bg-white border border-ml-border px-3 py-2 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-ml-blue"
                    >
                      <option value="single_choice">Single Choice</option>
                      <option value="multi_choice">Multiple Choice</option>
                      <option value="likert">Likert Scale</option>
                      <option value="open_text">Open Text / Free Text</option>
                    </select>
                  </div>

                  {/* Question Text */}
                  <div className="sm:col-span-3">
                    <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block mb-1">Question Description</label>
                    <input
                      type="text"
                      placeholder="e.g., Which pricing plan fits your budget?"
                      value={newQuestion.text}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, text: e.target.value }))}
                      className="w-full border border-ml-border px-3 py-2 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ml-blue bg-white"
                    />
                  </div>
                </div>

                {/* Option inputs (choice types only) */}
                {(newQuestion.type === 'single_choice' || newQuestion.type === 'multi_choice') && (
                  <div className="space-y-2.5 p-4 bg-ml-surface/30 rounded-lg border border-ml-border">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider">Question Options</label>
                      <button
                        type="button"
                        onClick={addOptionField}
                        className="text-[10px] font-bold text-ml-blue hover:underline uppercase flex items-center gap-0.5"
                      >
                        <Plus size={10} /> Add Option
                      </button>
                    </div>

                    <div className="space-y-2">
                      {newQuestion.options.map((opt, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <span className="text-xs font-mono text-ml-ink-muted">{idx + 1}.</span>
                          <input
                            type="text"
                            placeholder={`Option ${idx + 1} text...`}
                            value={opt}
                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                            className="flex-1 border border-ml-border px-3 py-1.5 rounded text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ml-blue bg-white"
                          />
                          {newQuestion.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOptionField(idx)}
                              className="p-1.5 hover:bg-ml-danger/10 text-ml-danger rounded transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAddQuestion}
                  disabled={!newQuestion.text.trim() || ((newQuestion.type === 'single_choice' || newQuestion.type === 'multi_choice') && newQuestion.options.filter(o => o.trim()).length < 2)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-ml-ink hover:bg-ml-ink-muted disabled:bg-ml-border text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  ADD TO SURVEY
                </button>
              </div>
            </div>

          </div>

          {/* Right Sidebar: Panel Configuration & Execution Trigger */}
          <div className="space-y-6">
            
            {/* Target Cohort Panel Selector */}
            <div className="bg-white rounded-lg border border-ml-border p-6 space-y-6">
              <div className="space-y-1">
                <h2 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={18} className="text-ml-blue" />
                  Target Cohort Panel
                </h2>
                <p className="text-[11px] text-ml-ink-muted font-medium">Select which persona respondents participate in the study simulation.</p>
              </div>

              <div className="space-y-3 border-t border-ml-border pt-4">
                {personas.map(persona => {
                  const isChecked = selectedPersonas.includes(persona.id);
                  return (
                    <label key={persona.id} className="flex items-start gap-3 p-2.5 rounded-lg border border-ml-border hover:bg-ml-surface/40 transition-colors cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setSelectedPersonas(prev => 
                            isChecked ? prev.filter(id => id !== persona.id) : [...prev, persona.id]
                          );
                        }}
                        className="mt-0.5 w-4 h-4 rounded text-ml-blue focus:ring-ml-blue focus:ring-offset-0 border-ml-border"
                      />
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-ml-ink">{persona.name}</div>
                        <div className="text-[10px] text-ml-ink-muted font-bold uppercase tracking-wider">{persona.segment}</div>
                        <div className="text-[10px] text-ml-blue font-semibold">Cohort size: 5 synthetic respondents</div>
                      </div>
                    </label>
                  );
                })}
              </div>

              {selectedPersonas.length === 0 && (
                <div className="flex gap-2 p-3 bg-ml-danger/10 border border-ml-danger/20 rounded-lg text-ml-danger items-start">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <span className="text-[10px] font-semibold leading-relaxed">Please select at least one persona cohort to participate in the simulation.</span>
                </div>
              )}
            </div>

            {/* Run Study Trigger Card */}
            <div className="bg-white rounded-lg border border-ml-border p-6 space-y-6">
              <div className="space-y-1">
                <h2 className="text-sm font-black uppercase tracking-wider">Simulation Launchpad</h2>
                <p className="text-[11px] text-ml-ink-muted font-medium">Estimated cost: ~0.02 USD (Mock generation is free & offline)</p>
              </div>

              <div className="space-y-3.5 border-t border-ml-border pt-4 text-xs font-medium text-ml-ink-muted leading-relaxed">
                <div className="flex justify-between border-b border-ml-border/50 pb-1.5">
                  <span className="font-bold">Total Respondents:</span>
                  <span className="font-bold text-ml-ink">{selectedPersonas.length * 5}</span>
                </div>
                <div className="flex justify-between border-b border-ml-border/50 pb-1.5">
                  <span className="font-bold">Total Questions:</span>
                  <span className="font-bold text-ml-ink">{activeStudy.questions?.length || 0}</span>
                </div>
                <div className="flex justify-between border-b border-ml-border/50 pb-1.5">
                  <span className="font-bold">Model Engine:</span>
                  <span className="font-bold text-ml-blue">Mock Rule-Engine Fallback</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunSimulation}
                disabled={selectedPersonas.length === 0 || !activeStudy.questions || activeStudy.questions.length === 0}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-ml-blue hover:bg-ml-blue-strong disabled:bg-ml-border text-white text-xs font-bold rounded-lg transition-colors duration-150 shadow-xs cursor-pointer"
              >
                <Play size={14} fill="currentColor" />
                RUN STUDY SIMULATION
              </button>
            </div>

          </div>

        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-ml-border rounded-lg space-y-3">
          <HelpCircle size={36} className="mx-auto text-ml-border" />
          <h2 className="text-md font-bold uppercase tracking-wider">No Studies Created</h2>
          <p className="text-xs text-ml-ink-muted max-w-sm mx-auto">Create a survey study using the form in the header to get started building questions.</p>
        </div>
      )}

    </div>
  );
};
