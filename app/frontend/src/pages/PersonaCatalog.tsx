import React, { useEffect, useState } from 'react';
import type { Persona } from '../types';
import { 
  getProjectPersonas, 
  createPersona, 
  updatePersona, 
  deletePersona 
} from '../api/client';
import { 
  ShieldAlert, 
  Quote, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Compass, 
  Award,
  Plus,
  Trash2,
  Edit,
  X,
  Save
} from 'lucide-react';

interface PersonaCatalogProps {
  projectId: string;
}

export const PersonaCatalog: React.FC<PersonaCatalogProps> = ({ projectId }) => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form toggles
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formSegment, setFormSegment] = useState('');
  const [formQuote, setFormQuote] = useState('');
  const [formConfidence, setFormConfidence] = useState<number>(80);

  // List Fields (we take them as newline-separated strings and split)
  const [formDemographics, setFormDemographics] = useState('');
  const [formGoals, setFormGoals] = useState('');
  const [formPainPoints, setFormPainPoints] = useState('');
  const [formMotivations, setFormMotivations] = useState('');
  const [formBuying, setFormBuying] = useState('');
  const [formRules, setFormRules] = useState('');
  const [formObjections, setFormObjections] = useState('');
  const [formChannels, setFormChannels] = useState('');
  const [formAssumptions, setFormAssumptions] = useState('');

  const loadPersonas = async () => {
    try {
      const data = await getProjectPersonas(projectId);
      setPersonas(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load personas.');
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    loadPersonas().finally(() => setLoading(false));
  }, [projectId]);

  const handleStartCreate = () => {
    setEditingPersona(null);
    setFormName('');
    setFormSegment('');
    setFormQuote('');
    setFormConfidence(80);
    setFormDemographics('Age: 21\nLocation: Hanoi, Vietnam\nYear: 3rd Year Student\nMajor: Business');
    setFormGoals('Improve communication skills\nGet an international job');
    setFormPainPoints('High price of traditional classes\nLack of partners to practice with');
    setFormMotivations('Secure a good career\nCommunicate with global peers');
    setFormBuying('Compares options online\nLooks for trials');
    setFormRules('Must cost under 100k VND/month\nMust show immediate value');
    setFormObjections('Automatic premium bill traps\nToo gamified or childish interface');
    setFormChannels('TikTok\nFacebook Groups');
    setFormAssumptions('AI feedback is good enough for practice');
    setShowForm(true);
  };

  const handleStartEdit = (p: Persona) => {
    setEditingPersona(p);
    setFormName(p.name);
    setFormSegment(p.segment);
    setFormQuote(p.quote);
    setFormConfidence(p.confidence_score);
    setFormDemographics(p.demographics.join('\n'));
    setFormGoals(p.goals.join('\n'));
    setFormPainPoints(p.pain_points.join('\n'));
    setFormMotivations(p.motivations.join('\n'));
    setFormBuying(p.buying_behavior.join('\n'));
    setFormRules(p.decision_rules.join('\n'));
    setFormObjections(p.objections.join('\n'));
    setFormChannels(p.channels.join('\n'));
    setFormAssumptions(p.assumptions.join('\n'));
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this persona? This will also remove any synthetic respondent profiles generated from it.')) {
      return;
    }
    setLoading(true);
    try {
      await deletePersona(id);
      await loadPersonas();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete persona.');
    } finally {
      setLoading(false);
    }
  };

  const parseLines = (text: string): string[] => {
    return text.split('\n').map(l => l.trim()).filter(Boolean);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSegment.trim() || !formQuote.trim()) {
      alert('Please fill out name, segment, and quote.');
      return;
    }

    const payload = {
      name: formName.trim(),
      segment: formSegment.trim(),
      quote: formQuote.trim(),
      demographics: parseLines(formDemographics),
      goals: parseLines(formGoals),
      pain_points: parseLines(formPainPoints),
      motivations: parseLines(formMotivations),
      buying_behavior: parseLines(formBuying),
      decision_rules: parseLines(formRules),
      objections: parseLines(formObjections),
      channels: parseLines(formChannels),
      assumptions: parseLines(formAssumptions),
      confidence_score: Number(formConfidence)
    };

    setLoading(true);
    try {
      if (editingPersona) {
        await updatePersona(editingPersona.id, payload);
      } else {
        await createPersona(projectId, payload);
      }
      setShowForm(false);
      setEditingPersona(null);
      await loadPersonas();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to save persona.');
    } finally {
      setLoading(false);
    }
  };

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
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ml-blue-soft border border-ml-border text-ml-blue-strong text-xs font-bold w-fit">
            <Compass size={14} className="animate-spin-slow" />
            {personas.length} PERSONAS PROFILED
          </div>
          <button
            onClick={handleStartCreate}
            className="flex items-center gap-1 px-4 py-1.5 bg-ml-blue hover:bg-ml-blue-strong text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus size={14} />
            CREATE PERSONA
          </button>
        </div>
      </div>

      {/* Form Overlay Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-ml-ink/80 backdrop-blur-xs flex items-center justify-center z-50 p-6 overflow-y-auto">
          <div className="bg-white rounded-lg border border-ml-border max-w-2xl w-full p-6 space-y-6 shadow-xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-ml-border pb-3">
              <h2 className="text-sm font-black uppercase tracking-wider flex items-center gap-1.5">
                {editingPersona ? <Edit size={16} className="text-ml-blue" /> : <Plus size={16} className="text-ml-blue" />}
                {editingPersona ? `Edit Persona: ${editingPersona.name}` : 'Create Persona Profile'}
              </h2>
              <button 
                onClick={() => setShowForm(false)}
                className="p-1.5 hover:bg-ml-surface rounded text-ml-ink-muted transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    placeholder="Minh Thu"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Segment Label</label>
                  <input
                    type="text"
                    placeholder="Price-sensitive student"
                    value={formSegment}
                    onChange={e => setFormSegment(e.target.value)}
                    className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Confidence Score (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formConfidence}
                    onChange={e => setFormConfidence(Number(e.target.value))}
                    className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Short Quote</label>
                <input
                  type="text"
                  placeholder="I want to learn speaking but pricing is a barrier..."
                  value={formQuote}
                  onChange={e => setFormQuote(e.target.value)}
                  className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue"
                  required
                />
              </div>

              {/* Textareas for arrays (newline separated) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Demographics (One per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Age: 20&#10;Location: Hanoi&#10;Major: Accounting"
                    value={formDemographics}
                    onChange={e => setFormDemographics(e.target.value)}
                    className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[11px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Key Goals (One per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Improve everyday communication&#10;Pass graduation criteria"
                    value={formGoals}
                    onChange={e => setFormGoals(e.target.value)}
                    className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Pain Points (One per line)</label>
                  <textarea
                    rows={3}
                    placeholder="High cost of speaking centers&#10;Feature paywalls in apps"
                    value={formPainPoints}
                    onChange={e => setFormPainPoints(e.target.value)}
                    className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[11px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Primary Objections (One per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Hidden subscription traps&#10;AI accuracy concerns"
                    value={formObjections}
                    onChange={e => setFormObjections(e.target.value)}
                    className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Decision Rules (One per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Must be under 100k VND/month&#10;Must have clear free trial"
                    value={formRules}
                    onChange={e => setFormRules(e.target.value)}
                    className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[11px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Synthetic Assumptions (One per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Assumes speech software doesn't recognize accents"
                    value={formAssumptions}
                    onChange={e => setFormAssumptions(e.target.value)}
                    className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Motivations (One per line)</label>
                  <textarea
                    rows={2}
                    value={formMotivations}
                    onChange={e => setFormMotivations(e.target.value)}
                    className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[11px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Buying Behavior (One per line)</label>
                  <textarea
                    rows={2}
                    value={formBuying}
                    onChange={e => setFormBuying(e.target.value)}
                    className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[11px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Channel Preferences (One per line)</label>
                  <textarea
                    rows={2}
                    value={formChannels}
                    onChange={e => setFormChannels(e.target.value)}
                    className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[11px]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-ml-blue hover:bg-ml-blue-strong text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                <Save size={14} />
                SAVE PERSONA PROFILE
              </button>
            </form>
          </div>
        </div>
      )}

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

      {personas.length === 0 ? (
        <div className="text-center py-24 bg-white border border-ml-border border-dashed rounded-lg space-y-3">
          <Compass size={44} className="mx-auto text-ml-border" />
          <h3 className="text-sm font-bold uppercase tracking-wider">No Personas Profiled</h3>
          <p className="text-xs text-ml-ink-muted max-w-xs mx-auto">Create manual personas using the button in the top right to define target customer segments.</p>
        </div>
      ) : (
        /* Persona Cards Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {personas.map((persona) => {
            let cardHeaderBg = 'bg-emerald-50/50';
            let badgeBg = 'bg-emerald-50 text-ml-success border-emerald-200';
            let progressBg = 'bg-ml-success';

            // Differentiate header styles based on common IDs or indices
            if (persona.id.includes('career') || persona.segment.toLowerCase().includes('career')) {
              cardHeaderBg = 'bg-ml-blue-soft/30';
              badgeBg = 'bg-ml-blue-soft text-ml-blue-strong border-ml-blue/20';
              progressBg = 'bg-ml-blue';
            } else if (persona.id.includes('casual') || persona.segment.toLowerCase().includes('casual')) {
              cardHeaderBg = 'bg-amber-50/50';
              badgeBg = 'bg-amber-50 text-ml-warning border-amber-200';
              progressBg = 'bg-ml-warning';
            }

            return (
              <div
                key={persona.id}
                className="flex flex-col rounded-lg border border-ml-border bg-white shadow-xs overflow-hidden transition-all duration-200 hover:border-ml-blue/30 hover:shadow-md relative group"
              >
                
                {/* CRUD Actions Panel overlay on hover */}
                <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex gap-1 z-20">
                  <button
                    onClick={() => handleStartEdit(persona)}
                    className="p-1.5 bg-white border border-ml-border hover:bg-ml-surface hover:text-ml-blue text-ml-ink-muted rounded transition-all cursor-pointer"
                    title="Edit Persona"
                  >
                    <Edit size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(persona.id)}
                    className="p-1.5 bg-white border border-ml-border hover:bg-ml-surface hover:text-ml-danger text-ml-ink-muted rounded transition-all cursor-pointer"
                    title="Delete Persona"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

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

                  <h2 className="text-[20px] font-black text-ml-ink tracking-tight uppercase leading-tight pr-14">{persona.name}</h2>
                  
                  {/* Demographics list */}
                  {persona.demographics && persona.demographics.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {persona.demographics.map((demo, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 bg-white border border-ml-border rounded text-ml-ink-muted font-bold uppercase">
                          {demo}
                        </span>
                      ))}
                    </div>
                  )}
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
                  {persona.goals && persona.goals.length > 0 && (
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
                  )}

                  {/* Pain Points */}
                  {persona.pain_points && persona.pain_points.length > 0 && (
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
                  )}

                  {/* Objections */}
                  {persona.objections && persona.objections.length > 0 && (
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
                  )}

                  {/* Decision Rules */}
                  {persona.decision_rules && persona.decision_rules.length > 0 && (
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
                  )}

                  {/* Assumptions */}
                  {persona.assumptions && persona.assumptions.length > 0 && (
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
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
