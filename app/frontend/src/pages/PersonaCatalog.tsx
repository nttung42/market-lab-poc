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
  Compass, 
  Award,
  Plus,
  Trash2,
  Edit,
  X,
  Save,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  User,
  Activity,
  Check,
  Zap,
  Clock
} from 'lucide-react';

interface PersonaCatalogProps {
  projectId: string;
}

type WizardStep = 'identity' | 'jtbd' | 'barriers' | 'behavior' | 'journey' | 'validation';

export const PersonaCatalog: React.FC<PersonaCatalogProps> = ({ projectId }) => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form toggles
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);
  const [wizardStep, setWizardStep] = useState<WizardStep>('identity');

  // AI Assistant States
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiProgress, setAiProgress] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Form Fields - Step 1: Identity & Demographics
  const [formName, setFormName] = useState('');
  const [formSegment, setFormSegment] = useState('');
  const [formQuote, setFormQuote] = useState('');
  const [formDemographics, setFormDemographics] = useState('');
  const [formAge, setFormAge] = useState<number>(20);
  const [formLocation, setFormLocation] = useState('Hanoi, Vietnam');
  const [formGender, setFormGender] = useState('Female');
  const [formOccupation, setFormOccupation] = useState('University Student');
  const [formIncome, setFormIncome] = useState('Low');

  // Form Fields - Step 2: JTBD & Goals
  const [formJtbdFunctional, setFormJtbdFunctional] = useState('');
  const [formJtbdEmotional, setFormJtbdEmotional] = useState('');
  const [formJtbdSocial, setFormJtbdSocial] = useState('');
  const [formJtbdSuccessCriteria, setFormJtbdSuccessCriteria] = useState('');
  const [formGoals, setFormGoals] = useState('');
  const [formMotivations, setFormMotivations] = useState('');

  // Form Fields - Step 3: Pain Points & Barriers
  const [formPainPoints, setFormPainPoints] = useState('');
  const [formObjections, setFormObjections] = useState('');

  // Form Fields - Step 4: Decision & Buying Behavior
  const [formBuying, setFormBuying] = useState('');
  const [formRules, setFormRules] = useState('');
  const [formChannels, setFormChannels] = useState('');
  const [formPriceSensitivity, setFormPriceSensitivity] = useState('Medium');
  const [formTechSavviness, setFormTechSavviness] = useState('Medium');
  const [formRiskTolerance, setFormRiskTolerance] = useState('Neutral');

  // Form Fields - Step 5: Product Fit & Journey Map
  const [formMustHaves, setFormMustHaves] = useState('');
  const [formNiceToHaves, setFormNiceToHaves] = useState('');
  const [formDealBreakers, setFormDealBreakers] = useState('');
  const [formAlternatives, setFormAlternatives] = useState('');
  
  // Structured Journey Map State (Initiates with empty template)
  const [journeyStages, setJourneyStages] = useState([
    { stage: 'Awareness', goals: 'Find speaking apps', pain_points: 'Centers are too expensive', touchpoints: 'TikTok ads' },
    { stage: 'Consideration', goals: 'Compare English apps', pain_points: 'Fear of auto-billing', touchpoints: 'App reviews' },
    { stage: 'Conversion', goals: 'Register and try', pain_points: 'Hates mandatory card inputs', touchpoints: 'Signup screens' },
    { stage: 'Onboarding', goals: 'Start first lesson', pain_points: 'Interface looks complex', touchpoints: 'Speaking mock' },
    { stage: 'Retention', goals: 'Practice daily', pain_points: 'Easily loses motivation', touchpoints: 'Streak reminders' }
  ]);

  // Form Fields - Step 6: Validation & Assumptions
  const [formConfidence, setFormConfidence] = useState<number>(80);
  const [formAssumptions, setFormAssumptions] = useState('');
  const [formEvidence, setFormEvidence] = useState('');
  const [formIsHumanValidated, setFormIsHumanValidated] = useState<boolean>(false);

  // Card View States - tracking active tab for each persona ID
  const [cardTabs, setCardTabs] = useState<Record<string, 'overview' | 'jtbd' | 'journey' | 'fit'>>({});

  const loadPersonas = async () => {
    try {
      const data = await getProjectPersonas(projectId);
      setPersonas(data);
      // Initialize tabs
      const tabsMap: Record<string, 'overview' | 'jtbd' | 'journey' | 'fit'> = {};
      data.forEach(p => {
        tabsMap[p.id] = 'overview';
      });
      setCardTabs(tabsMap);
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
    setWizardStep('identity');
    setAiPrompt('');
    setSelectedTemplate('');

    // Clear and set defaults
    setFormName('');
    setFormSegment('');
    setFormQuote('');
    setFormAge(20);
    setFormLocation('Hanoi, Vietnam');
    setFormGender('Female');
    setFormOccupation('University Student');
    setFormIncome('Low');
    setFormDemographics('Age: 20\nLocation: Hanoi, Vietnam\nYear: 2nd Year Student\nMajor: Accounting');

    setFormJtbdFunctional('');
    setFormJtbdEmotional('');
    setFormJtbdSocial('');
    setFormJtbdSuccessCriteria('');
    setFormGoals('Improve English speaking\nPass exams');
    setFormMotivations('Secure a good career\nCommunicate with peers');

    setFormPainPoints('High price of traditional classes\nLack of practice partners');
    setFormObjections('Automatic premium bill traps\nToo gamified/childish UI');

    setFormBuying('Compares options online\nLooks for trials');
    setFormRules('Must cost under 100k VND/month\nMust show immediate value');
    setFormChannels('TikTok\nFacebook Groups');
    setFormPriceSensitivity('Medium');
    setFormTechSavviness('Medium');
    setFormRiskTolerance('Neutral');

    setFormMustHaves('Free trial\nClean audio');
    setFormNiceToHaves('Score tracking');
    setFormDealBreakers('Hidden billing');
    setFormAlternatives('Duolingo\nSpeaking Centers');

    setJourneyStages([
      { stage: 'Awareness', goals: 'Find speaking apps', pain_points: 'Centers are too expensive', touchpoints: 'TikTok ads' },
      { stage: 'Consideration', goals: 'Compare English apps', pain_points: 'Fear of auto-billing', touchpoints: 'App reviews' },
      { stage: 'Conversion', goals: 'Register and try', pain_points: 'Hates mandatory card inputs', touchpoints: 'Signup screens' },
      { stage: 'Onboarding', goals: 'Start first lesson', pain_points: 'Interface looks complex', touchpoints: 'Speaking mock' },
      { stage: 'Retention', goals: 'Practice daily', pain_points: 'Easily loses motivation', touchpoints: 'Streak reminders' }
    ]);

    setFormConfidence(80);
    setFormAssumptions('AI feedback is good enough for practice');
    setFormEvidence('EdTech Survey 2026');
    setFormIsHumanValidated(false);

    setShowForm(true);
  };

  const handleStartEdit = (p: Persona) => {
    setEditingPersona(p);
    setWizardStep('identity');
    setAiPrompt('');
    setSelectedTemplate('');

    setFormName(p.name);
    setFormSegment(p.segment);
    setFormQuote(p.quote);
    setFormDemographics(p.demographics.join('\n'));

    // Try to parse structured items or fallback
    setFormAge(p.psychographics?.tech_savviness ? parseInt(p.demographics[0]?.split(':')[1]?.trim() || '21') : 21);
    setFormLocation(p.demographics[1]?.split(':')[1]?.trim() || 'Hanoi, Vietnam');
    setFormOccupation(p.demographics[3]?.split(':')[1]?.trim() || 'Student');

    setFormJtbdFunctional(p.jtbd?.functional_job || '');
    setFormJtbdEmotional(p.jtbd?.emotional_job || '');
    setFormJtbdSocial(p.jtbd?.social_job || '');
    setFormJtbdSuccessCriteria(p.jtbd?.success_criteria.join('\n') || '');
    
    setFormGoals(p.goals.join('\n'));
    setFormMotivations(p.motivations.join('\n'));
    setFormPainPoints(p.pain_points.join('\n'));
    setFormObjections(p.objections.join('\n'));
    setFormBuying(p.buying_behavior.join('\n'));
    setFormRules(p.decision_rules.join('\n'));
    setFormChannels(p.channels.join('\n'));

    setFormPriceSensitivity(p.psychographics?.risk_tolerance ? 'High' : 'Medium'); // approximation
    setFormTechSavviness(p.psychographics?.tech_savviness || 'Medium');
    setFormRiskTolerance(p.psychographics?.risk_tolerance || 'Neutral');

    setFormMustHaves(p.product_fit?.must_haves.join('\n') || '');
    setFormNiceToHaves(p.product_fit?.nice_to_haves.join('\n') || '');
    setFormDealBreakers(p.product_fit?.deal_breakers.join('\n') || '');
    setFormAlternatives(p.product_fit?.alternatives.join('\n') || '');

    if (p.journey_map && p.journey_map.length > 0) {
      setJourneyStages(p.journey_map.map(s => ({
        stage: s.stage,
        goals: s.goals.join(', '),
        pain_points: s.pain_points.join(', '),
        touchpoints: s.touchpoints.join(', ')
      })));
    } else {
      setJourneyStages([
        { stage: 'Awareness', goals: 'Find speaking apps', pain_points: 'Centers are too expensive', touchpoints: 'TikTok ads' },
        { stage: 'Consideration', goals: 'Compare English apps', pain_points: 'Fear of auto-billing', touchpoints: 'App reviews' },
        { stage: 'Conversion', goals: 'Register and try', pain_points: 'Hates mandatory card inputs', touchpoints: 'Signup screens' },
        { stage: 'Onboarding', goals: 'Start first lesson', pain_points: 'Interface looks complex', touchpoints: 'Speaking mock' },
        { stage: 'Retention', goals: 'Practice daily', pain_points: 'Easily loses motivation', touchpoints: 'Streak reminders' }
      ]);
    }

    setFormConfidence(p.confidence_score);
    setFormAssumptions(p.assumptions.join('\n'));
    setFormEvidence(p.validation?.evidence_sources.join('\n') || '');
    setFormIsHumanValidated(p.validation?.is_human_validated || false);

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

  const handleJourneyStageChange = (index: number, field: 'goals' | 'pain_points' | 'touchpoints', value: string) => {
    const updated = [...journeyStages];
    updated[index][field] = value;
    setJourneyStages(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSegment.trim() || !formQuote.trim()) {
      alert('Please fill out Name, Segment, and Quote.');
      return;
    }

    // Build the payload mapping both basic flat lists and new structured objects
    const payload = {
      name: formName.trim(),
      segment: formSegment.trim(),
      quote: formQuote.trim(),
      demographics: [
        `Age: ${formAge}`,
        `Location: ${formLocation}`,
        `Gender: ${formGender}`,
        `Occupation: ${formOccupation}`,
        `Income: ${formIncome}`
      ],
      goals: parseLines(formGoals),
      pain_points: parseLines(formPainPoints),
      motivations: parseLines(formMotivations),
      buying_behavior: parseLines(formBuying),
      decision_rules: parseLines(formRules),
      objections: parseLines(formObjections),
      channels: parseLines(formChannels),
      assumptions: parseLines(formAssumptions),
      confidence_score: Number(formConfidence),
      
      // Structured features
      jtbd: {
        functional_job: formJtbdFunctional.trim() || `Improve speaking in ${formOccupation} setting`,
        emotional_job: formJtbdEmotional.trim() || 'Feel confident and escape fear of criticism',
        social_job: formJtbdSocial.trim() || 'Gain career respect and peer alignment',
        success_criteria: parseLines(formJtbdSuccessCriteria)
      },
      psychographics: {
        personality_traits: ['Practical', 'Analytical'],
        core_values: ['Efficiency', 'Growth'],
        risk_tolerance: formRiskTolerance,
        tech_savviness: formTechSavviness
      },
      product_fit: {
        must_haves: parseLines(formMustHaves),
        nice_to_haves: parseLines(formNiceToHaves),
        deal_breakers: parseLines(formDealBreakers),
        alternatives: parseLines(formAlternatives)
      },
      journey_map: journeyStages.map(s => ({
        stage: s.stage,
        goals: s.goals.split(',').map(i => i.trim()).filter(Boolean),
        pain_points: s.pain_points.split(',').map(i => i.trim()).filter(Boolean),
        touchpoints: s.touchpoints.split(',').map(i => i.trim()).filter(Boolean)
      })),
      validation: {
        is_human_validated: formIsHumanValidated,
        evidence_sources: parseLines(formEvidence),
        last_validated_at: formIsHumanValidated ? new Date().toISOString() : undefined
      }
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

  // Mock AI Generator simulation
  const handleAIGenerate = () => {
    if (!aiPrompt && !selectedTemplate) {
      alert('Please select a template or write an prompt details.');
      return;
    }

    setGeneratingAI(true);
    setAiProgress('Analyzing project target audience...');

    setTimeout(() => {
      setAiProgress('Drafting Jobs-to-be-Done (JTBD) framework...');
      setTimeout(() => {
        setAiProgress('Simulating customer journey touchpoints...');
        setTimeout(() => {
          setAiProgress('Synthesizing buying behavior & objections...');
          setTimeout(() => {
            // Apply mock template data
            if (selectedTemplate === 'ielts' || aiPrompt.toLowerCase().includes('ielts') || aiPrompt.toLowerCase().includes('exam')) {
              setFormName('Thao Nguyen');
              setFormSegment('IELTS Speaking Candidate');
              setFormQuote('I need a speaking band 7.0 for graduation, but practicing alone feels useless and center mock tests are too stressful.');
              setFormAge(22);
              setFormLocation('HCMC, Vietnam');
              setFormGender('Female');
              setFormOccupation('Final-year Student');
              setFormIncome('Medium');
              setFormJtbdFunctional('Practice IELTS parts 1-3 with exact time limits, prompt cards, and automated band scoring.');
              setFormJtbdEmotional('Feel composed, secure, and confident speaking to an examiner under pressure.');
              setFormJtbdSocial('Impress future employers and classmates with high credentials.');
              setFormJtbdSuccessCriteria('IELTS band 7.0 score\nDetailed feedback on grammar mistakes\nReduced speaking anxiety');
              setFormGoals('Reach IELTS band 7.0 speaking\nImprove pronunciation accuracy\nPractice daily topics');
              setFormMotivations('Graduate on time\nApply for master scholarships\nAccess English reference documents');
              setFormPainPoints('Centers charge 500k VND per mock test\nNo direct feedback on grammatical mistakes when studying alone\nRobotic feedback from standard speaking apps');
              setFormObjections('Is the AI rating aligned with IELTS standards?\nDo lesson cards actually adapt to my level?\nToo costly for premium options');
              setFormBuying('Compares band score accuracy online\nChecks review vlogs of IELTS teachers');
              setFormRules('Must have IELTS-specific grading keys\nMock interview length under 20 minutes\nPaid plans under 200k VND/month');
              setFormChannels('TikTok reviews\nIELTS sharing groups on Facebook');
              setFormPriceSensitivity('Medium');
              setFormTechSavviness('High');
              setFormRiskTolerance('Neutral');
              setFormMustHaves('Realistic mock exam interface\nInstant grammar checks\nAudio downloads');
              setFormNiceToHaves('Vocabulary suggestions for band 8.0\nProgress trackers');
              setFormDealBreakers('No detailed explanation of scores\nSlow interface response times');
              setFormAlternatives('IELTS Centers\nYoutube speaking tests\n1:1 English tutors');
              setJourneyStages([
                { stage: 'Awareness', goals: 'Find IELTS speaking mock apps', pain_points: 'Tutors cost too much', touchpoints: 'TikTok IELTS channel' },
                { stage: 'Consideration', goals: 'Compare grading accuracy', pain_points: 'Worries about AI accuracy', touchpoints: 'App store screenshots' },
                { stage: 'Conversion', goals: 'Subscribe to a 1-month test pack', pain_points: 'Is checkout secure?', touchpoints: 'Promo codes' },
                { stage: 'Onboarding', goals: 'Run first IELTS Part 1 simulation', pain_points: 'Accents not recognized', touchpoints: 'Part 1 intro guide' },
                { stage: 'Retention', goals: 'Complete 4 mocks/week', pain_points: 'Frustration with static topics', touchpoints: 'Mock calendar alerts' }
              ]);
              setFormConfidence(92);
              setFormAssumptions('Assumes students understand standard IELTS grading rubrics');
              setFormEvidence('IELTS Vietnam candidate survey 2025');
              setFormIsHumanValidated(true);
            } else if (selectedTemplate === 'corporate' || aiPrompt.toLowerCase().includes('job') || aiPrompt.toLowerCase().includes('work') || aiPrompt.toLowerCase().includes('business')) {
              setFormName('Quoc Anh');
              setFormSegment('Corporate Job Hunter');
              setFormQuote('I can write emails well, but I freeze and stumble when explaining technical architectures to foreign managers.');
              setFormAge(24);
              setFormLocation('Hanoi, Vietnam');
              setFormGender('Male');
              setFormOccupation('Junior Software Engineer');
              setFormIncome('Medium');
              setFormJtbdFunctional('Simulate realistic behavioral job interviews (STAR method) with corporate vocabulary checks.');
              setFormJtbdEmotional('Feel confident, professional, and organized during tough corporate interviews.');
              setFormJtbdSocial('Secure high-paying jobs at global firms and build international team networks.');
              setFormJtbdSuccessCriteria('Passing interviews at MNCs\nMastering professional business vocabulary\nSpeaking smoothly without hesitation');
              setFormGoals('Master business terminology\nPerform STAR interview method fluently\nImprove oral presentation flow');
              setFormMotivations('Double current salary at a foreign firm\nWorking in global projects\nRelocation opportunities');
              setFormPainPoints('No access to professional interviewers\nGeneral apps only teach supermarket dialogues, not tech/business terms\nHard to track verbal grammar errors');
              setFormObjections('Are interview scenarios customizable by industry?\nSpeech analytics too simple for tech terms?\nHigh switching costs from current center course');
              setFormBuying('Looks for tech blog recommendations\nReads employee reviews on LinkedIn');
              setFormRules('Must have industry-specific mock tracks\nGrammar checking in real-time\nOffers mock feedback export');
              setFormChannels('LinkedIn posts\nTech review blogs\nHR experts recommendations');
              setFormPriceSensitivity('Low');
              setFormTechSavviness('High');
              setFormRiskTolerance('Risk-seeking');
              setFormMustHaves('STAR method templates\nIT/Business vocabulary guides\nDetailed mock transcripts');
              setFormNiceToHaves('AI recruiter chat simulations\nBody language advice');
              setFormDealBreakers('Too simple/childish design\nSlow or generic questions');
              setFormAlternatives('Interview coaches\nLinkedIn interview guides\nSelf-recording video practice');
              setJourneyStages([
                { stage: 'Awareness', goals: 'Find business English mock tools', pain_points: 'General apps feel too casual', touchpoints: 'LinkedIn IT groups' },
                { stage: 'Consideration', goals: 'Compare custom industry tracks', pain_points: 'No IT-specific mocks', touchpoints: 'Feature details list' },
                { stage: 'Conversion', goals: 'Buy annual pro membership', pain_points: 'Wants company invoice options', touchpoints: 'Pricing table' },
                { stage: 'Onboarding', goals: 'Do a mock behavioral interview', pain_points: 'Feedback feels generic', touchpoints: 'AI recruiter welcome' },
                { stage: 'Retention', goals: 'Practice 2 interviews/week', pain_points: 'Needs new question sets', touchpoints: 'Job search dashboard' }
              ]);
              setFormConfidence(88);
              setFormAssumptions('Assumes user knows basic tech and business terms in writing');
              setFormEvidence('Tech job seeker survey Hanoi 2026');
              setFormIsHumanValidated(true);
            } else {
              // Default/Casual Template
              setFormName('Khanh Vy');
              setFormSegment('Casual Learner');
              setFormQuote('I just want to speak natural English without thinking about grammar exams. It needs to be fun and stress-free.');
              setFormAge(19);
              setFormLocation('Da Nang, Vietnam');
              setFormGender('Female');
              setFormOccupation('Graphic Design Student');
              setFormIncome('Low');
              setFormJtbdFunctional('Practice speaking casual conversations with natural, emotional AI characters.');
              setFormJtbdEmotional('Enjoy learning English as a relaxing hobby, avoiding academic pressure.');
              setFormJtbdSocial('Make friends with foreign students and follow global art communities.');
              setFormJtbdSuccessCriteria('Understanding Netflix shows without sub\nMaintaining a daily learning streak\nTalking naturally about design');
              setFormGoals('Practice everyday conversations\nImprove pop-culture slang\nBuild a stress-free daily habit');
              setFormMotivations('Watch movies subtitle-free\nEnjoy foreign music\nTravel abroad comfortably');
              setFormPainPoints('Grammar apps feel too dry and repetitive\nAnxious about speaking to native speakers directly\nStreak notifications that make me feel guilty');
              setFormObjections('Robotic AI voices that sound boring\nToo expensive for a casual hobby app\nIntrusive streak penalties');
              setFormBuying('Impulsively buys beautiful visual designs\nInfluenced by content creator ads');
              setFormRules('Lessons must take under 10 minutes\nModern and visual interface design\nFree-tier with option to watch ads');
              setFormChannels('Instagram feeds\nTikTok lifestyle vlogs\nApp Store banners');
              setFormPriceSensitivity('High');
              setFormTechSavviness('Medium');
              setFormRiskTolerance('Risk-averse');
              setFormMustHaves('Expressive AI audio voices\nGamified hooks\nDaily casual topics');
              setFormNiceToHaves('Vocabulary flashcards\nAccent matching games');
              setFormDealBreakers('Academic tests or grading boards\nBoring vocabulary list files');
              setFormAlternatives('Duolingo\nNetflix movies\nEnglish club chats');
              setJourneyStages([
                { stage: 'Awareness', goals: 'Find fun talk companion apps', pain_points: 'Traditional apps are boring', touchpoints: 'Instagram story ad' },
                { stage: 'Consideration', goals: 'Download free trial to test design', pain_points: 'Lacks interactive characters', touchpoints: 'App store screenshots' },
                { stage: 'Conversion', goals: 'Subscribe to ad-supported free tier', pain_points: 'Too many paywalls', touchpoints: 'Welcome popup' },
                { stage: 'Onboarding', goals: 'Complete first 3-min conversation', pain_points: 'Stiff AI voice', touchpoints: 'Avatar selector' },
                { stage: 'Retention', goals: 'Talk 5 mins daily', pain_points: 'Forgot to practice', touchpoints: 'Daily streak alerts' }
              ]);
              setFormConfidence(82);
              setFormAssumptions('Assumes students use apps mostly on mobile during commutes');
              setFormEvidence('App store review analysis 2026');
              setFormIsHumanValidated(false);
            }

            setGeneratingAI(false);
            setAiProgress('');
          }, 800);
        }, 800);
      }, 800);
    }, 800);
  };

  const toggleTab = (id: string, tab: 'overview' | 'jtbd' | 'journey' | 'fit') => {
    setCardTabs(prev => ({ ...prev, [id]: tab }));
  };

  if (loading && personas.length === 0) {
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

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8 text-ml-ink">
      {error && (
        <div className="p-4 bg-ml-danger/10 border border-ml-danger/20 text-ml-danger rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-ml-border">
        <div>
          <h1 className="text-[26px] md:text-[32px] font-black tracking-tight text-ml-ink uppercase flex items-center gap-2">
            <Compass className="text-ml-blue" />
            Persona Intelligence Studio
          </h1>
          <p className="text-xs text-ml-ink-muted mt-1 font-semibold max-w-2xl leading-relaxed">
            Create, calibrate, and manage customer personas. Underpinned by Jobs-to-be-Done (JTBD), customer journey maps, buying behavior profiles, and human validation evidence trackers.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ml-blue-soft border border-ml-blue/20 text-ml-blue-strong text-xs font-bold w-fit uppercase">
            <Sparkles size={14} className="animate-spin-slow" />
            {personas.length} Segments Profiled
          </div>
          <button
            onClick={handleStartCreate}
            className="flex items-center gap-1.5 px-4 py-2 bg-ml-blue hover:bg-ml-blue-strong text-white text-xs font-bold rounded-lg transition-all shadow-sm hover:shadow cursor-pointer"
          >
            <Plus size={15} />
            CREATE PERSONA
          </button>
        </div>
      </div>

      {/* Form Overlay Modal with Stepper and AI Assistant */}
      {showForm && (
        <div className="fixed inset-0 bg-ml-ink/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-ml-border max-w-6xl w-full flex flex-col lg:flex-row shadow-2xl overflow-hidden my-4 max-h-[92vh] animate-in fade-in zoom-in duration-200">
            
            {/* Left Column: AI Assistant Panel */}
            <div className="w-full lg:w-80 bg-ml-surface/40 border-b lg:border-b-0 lg:border-r border-ml-border p-5 flex flex-col justify-between shrink-0 space-y-5">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-ml-ink flex items-center gap-1.5">
                  <Sparkles size={15} className="text-ml-blue animate-pulse" />
                  AI Persona Generator
                </h3>
                <p className="text-[11px] text-ml-ink-muted leading-relaxed font-semibold">
                  Accelerate setup by generating structured personas based on professional templates or a custom prompt.
                </p>

                {/* Templates Selector */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Templates</label>
                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTemplate('ielts');
                        setAiPrompt('An IELTS student struggling with pronunciation and exam anxiety.');
                      }}
                      className={`text-left px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                        selectedTemplate === 'ielts' ? 'bg-ml-blue-soft border-ml-blue text-ml-blue-strong shadow-xs' : 'bg-white border-ml-border hover:bg-ml-surface'
                      }`}
                    >
                      🎓 IELTS Prep Candidate
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTemplate('corporate');
                        setAiPrompt('A young professional preparing for English job interviews at multinationals.');
                      }}
                      className={`text-left px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                        selectedTemplate === 'corporate' ? 'bg-ml-blue-soft border-ml-blue text-ml-blue-strong shadow-xs' : 'bg-white border-ml-border hover:bg-ml-surface'
                      }`}
                    >
                      💼 Corporate Job Seeker
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTemplate('casual');
                        setAiPrompt('A casual learner wanting to understand Netflix movies and pop slang.');
                      }}
                      className={`text-left px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                        selectedTemplate === 'casual' ? 'bg-ml-blue-soft border-ml-blue text-ml-blue-strong shadow-xs' : 'bg-white border-ml-border hover:bg-ml-surface'
                      }`}
                    >
                      🎭 Casual Subtitle-free Hobbyist
                    </button>
                  </div>
                </div>

                {/* Custom Prompt Input */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Custom Prompt</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your persona segment (e.g., stay-at-home parent learning on tablet)..."
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    className="w-full border border-ml-border p-2.5 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-medium text-xs resize-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-ml-border/60">
                {generatingAI ? (
                  <div className="space-y-2 p-3 bg-ml-blue-soft/30 border border-ml-blue/20 rounded-lg text-center animate-pulse">
                    <Zap className="mx-auto text-ml-blue animate-spin-slow" size={20} />
                    <span className="text-[10px] text-ml-blue-strong font-black block uppercase tracking-wider">Generating Persona</span>
                    <span className="text-[9px] text-ml-ink-muted font-bold block">{aiProgress}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAIGenerate}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-ml-blue hover:bg-ml-blue-strong text-white text-xs font-black rounded-lg transition-colors cursor-pointer uppercase shadow-xs"
                  >
                    <Sparkles size={13} />
                    Generate with AI
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Interactive Stepper Wizard Form */}
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Wizard Title & Step Navigator Header */}
              <div className="p-5 border-b border-ml-border flex items-center justify-between shrink-0 bg-ml-surface/10">
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-ml-ink">
                    {editingPersona ? <Edit size={15} className="text-ml-blue" /> : <Plus size={15} className="text-ml-blue" />}
                    {editingPersona ? `Edit Persona: ${editingPersona.name}` : 'Structured Persona Creator'}
                  </h2>
                  <p className="text-[10px] text-ml-ink-muted font-semibold mt-0.5">
                    Step {wizardStep === 'identity' ? '1' : wizardStep === 'jtbd' ? '2' : wizardStep === 'barriers' ? '3' : wizardStep === 'behavior' ? '4' : wizardStep === 'journey' ? '5' : '6'} of 6: {wizardStep.toUpperCase()}
                  </p>
                </div>
                
                <button 
                  onClick={() => setShowForm(false)}
                  className="p-1.5 hover:bg-ml-surface rounded-full text-ml-ink-muted transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Progress Stepper indicators */}
              <div className="flex px-5 py-3 border-b border-ml-border/50 shrink-0 bg-ml-surface/20 overflow-x-auto text-[10px] font-black uppercase tracking-wider text-ml-ink-muted scrollbar-none gap-2">
                <button
                  type="button"
                  onClick={() => setWizardStep('identity')}
                  className={`px-3 py-1 rounded-md border shrink-0 transition-all ${
                    wizardStep === 'identity' ? 'bg-ml-blue text-white border-ml-blue shadow-xs' : 'bg-white border-ml-border hover:bg-ml-surface'
                  }`}
                >
                  1. Identity
                </button>
                <button
                  type="button"
                  onClick={() => setWizardStep('jtbd')}
                  className={`px-3 py-1 rounded-md border shrink-0 transition-all ${
                    wizardStep === 'jtbd' ? 'bg-ml-blue text-white border-ml-blue shadow-xs' : 'bg-white border-ml-border hover:bg-ml-surface'
                  }`}
                >
                  2. JTBD & Goals
                </button>
                <button
                  type="button"
                  onClick={() => setWizardStep('barriers')}
                  className={`px-3 py-1 rounded-md border shrink-0 transition-all ${
                    wizardStep === 'barriers' ? 'bg-ml-blue text-white border-ml-blue shadow-xs' : 'bg-white border-ml-border hover:bg-ml-surface'
                  }`}
                >
                  3. Pain & Barriers
                </button>
                <button
                  type="button"
                  onClick={() => setWizardStep('behavior')}
                  className={`px-3 py-1 rounded-md border shrink-0 transition-all ${
                    wizardStep === 'behavior' ? 'bg-ml-blue text-white border-ml-blue shadow-xs' : 'bg-white border-ml-border hover:bg-ml-surface'
                  }`}
                >
                  4. Buying Behavior
                </button>
                <button
                  type="button"
                  onClick={() => setWizardStep('journey')}
                  className={`px-3 py-1 rounded-md border shrink-0 transition-all ${
                    wizardStep === 'journey' ? 'bg-ml-blue text-white border-ml-blue shadow-xs' : 'bg-white border-ml-border hover:bg-ml-surface'
                  }`}
                >
                  5. Journey Map
                </button>
                <button
                  type="button"
                  onClick={() => setWizardStep('validation')}
                  className={`px-3 py-1 rounded-md border shrink-0 transition-all ${
                    wizardStep === 'validation' ? 'bg-ml-blue text-white border-ml-blue shadow-xs' : 'bg-white border-ml-border hover:bg-ml-surface'
                  }`}
                >
                  6. Trust & Validation
                </button>
              </div>

              {/* Form Content Steps Area */}
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-semibold text-ml-ink">
                
                {/* STEP 1: IDENTITY & DEMOGRAPHICS */}
                {wizardStep === 'identity' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h4 className="text-[11px] font-black uppercase text-ml-blue tracking-wide border-b border-ml-border pb-1">Core Identity Attributes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Full Name Archetype</label>
                        <input
                          type="text"
                          placeholder="e.g. Minh Thu"
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
                          placeholder="e.g. Price-sensitive student"
                          value={formSegment}
                          onChange={e => setFormSegment(e.target.value)}
                          className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Short Quote (Mindset Descriptor)</label>
                      <input
                        type="text"
                        placeholder="e.g. I want to learn but pricing is my main barrier..."
                        value={formQuote}
                        onChange={e => setFormQuote(e.target.value)}
                        className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue"
                        required
                      />
                    </div>

                    <h4 className="text-[11px] font-black uppercase text-ml-blue tracking-wide border-b border-ml-border pt-4 pb-1">Structured Demographics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Age</label>
                        <input
                          type="number"
                          value={formAge}
                          onChange={e => setFormAge(Number(e.target.value))}
                          className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Location</label>
                        <input
                          type="text"
                          value={formLocation}
                          onChange={e => setFormLocation(e.target.value)}
                          className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Gender</label>
                        <select
                          value={formGender}
                          onChange={e => setFormGender(e.target.value)}
                          className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue"
                        >
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Non-binary">Non-binary</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Occupation</label>
                        <input
                          type="text"
                          value={formOccupation}
                          onChange={e => setFormOccupation(e.target.value)}
                          className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Income Tier</label>
                        <select
                          value={formIncome}
                          onChange={e => setFormIncome(e.target.value)}
                          className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue"
                        >
                          <option value="Low">Low (Below 5M VND)</option>
                          <option value="Medium">Medium (5M-15M VND)</option>
                          <option value="High">High (Above 15M VND)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1 pt-2">
                      <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Legacy Raw Demographics (Fallback storage, one per line)</label>
                      <textarea
                        rows={3}
                        value={formDemographics}
                        onChange={e => setFormDemographics(e.target.value)}
                        className="w-full border border-ml-border p-2.5 rounded-lg bg-ml-surface/10 focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[10px]"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: JOBS TO BE DONE (JTBD) & GOALS */}
                {wizardStep === 'jtbd' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h4 className="text-[11px] font-black uppercase text-ml-blue tracking-wide border-b border-ml-border pb-1">Jobs to be Done (JTBD) Framework</h4>
                    
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block flex items-center gap-1">
                          <Compass size={12} className="text-ml-blue" />
                          Functional Job
                        </label>
                        <p className="text-[10px] text-ml-ink-muted font-medium mb-1">What primary task or functional objective does this user want to achieve?</p>
                        <input
                          type="text"
                          placeholder="e.g. Pass IELTS speaking mock tests with detailed grading reports."
                          value={formJtbdFunctional}
                          onChange={e => setFormJtbdFunctional(e.target.value)}
                          className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block flex items-center gap-1">
                          <Activity size={12} className="text-ml-success" />
                          Emotional Job
                        </label>
                        <p className="text-[10px] text-ml-ink-muted font-medium mb-1">How does the user want to feel during or after completing the job?</p>
                        <input
                          type="text"
                          placeholder="e.g. Feel calm, confident, and escape the anxiety of making speaking errors in public."
                          value={formJtbdEmotional}
                          onChange={e => setFormJtbdEmotional(e.target.value)}
                          className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block flex items-center gap-1">
                          <User size={12} className="text-ml-warning" />
                          Social Job
                        </label>
                        <p className="text-[10px] text-ml-ink-muted font-medium mb-1">How does the user want to be perceived by their peers, managers, or community?</p>
                        <input
                          type="text"
                          placeholder="e.g. Stand out as an international-standard professional among corporate candidates."
                          value={formJtbdSocial}
                          onChange={e => setFormJtbdSocial(e.target.value)}
                          className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Job Success Criteria (One per line)</label>
                        <textarea
                          rows={2}
                          placeholder="e.g. IELTS 7.0 band score reached&#10;Correcting pronunciation mistakes instantly"
                          value={formJtbdSuccessCriteria}
                          onChange={e => setFormJtbdSuccessCriteria(e.target.value)}
                          className="w-full border border-ml-border p-2.5 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[10px]"
                        />
                      </div>
                    </div>

                    <h4 className="text-[11px] font-black uppercase text-ml-blue tracking-wide border-b border-ml-border pt-4 pb-1">Descriptive Goals & Motivations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Key Goals (One per line)</label>
                        <textarea
                          rows={3}
                          value={formGoals}
                          onChange={e => setFormGoals(e.target.value)}
                          className="w-full border border-ml-border p-2.5 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[10px]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Core Motivations (One per line)</label>
                        <textarea
                          rows={3}
                          value={formMotivations}
                          onChange={e => setFormMotivations(e.target.value)}
                          className="w-full border border-ml-border p-2.5 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[10px]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: PAIN POINTS & BARRIERS */}
                {wizardStep === 'barriers' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h4 className="text-[11px] font-black uppercase text-ml-blue tracking-wide border-b border-ml-border pb-1">Frictions & Objections</h4>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block flex items-center gap-1">
                        <AlertTriangle size={12} className="text-ml-danger" />
                        Key Pain Points & Frictions (One per line)
                      </label>
                      <textarea
                        rows={4}
                        placeholder="e.g. Traditional centers charge high subscription fees&#10;Struggles with business terminology"
                        value={formPainPoints}
                        onChange={e => setFormPainPoints(e.target.value)}
                        className="w-full border border-ml-border p-2.5 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[10px]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block flex items-center gap-1">
                        <ShieldAlert size={12} className="text-ml-warning" />
                        Primary Objections to Application Offer (One per line)
                      </label>
                      <textarea
                        rows={4}
                        placeholder="e.g. AI pronunciation feedback accuracy concerns&#10;Overly gamified layout that feels too casual"
                        value={formObjections}
                        onChange={e => setFormObjections(e.target.value)}
                        className="w-full border border-ml-border p-2.5 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[10px]"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 4: DECISION & BUYING BEHAVIOR */}
                {wizardStep === 'behavior' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h4 className="text-[11px] font-black uppercase text-ml-blue tracking-wide border-b border-ml-border pb-1">Buying Style & Decision Dynamics</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Price Sensitivity</label>
                        <select
                          value={formPriceSensitivity}
                          onChange={e => setFormPriceSensitivity(e.target.value)}
                          className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue"
                        >
                          <option value="Low">Low (Focuses on quality/results)</option>
                          <option value="Medium">Medium (Values price/performance)</option>
                          <option value="High">High (Always looks for cheapest/free)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Tech Savviness</label>
                        <select
                          value={formTechSavviness}
                          onChange={e => setFormTechSavviness(e.target.value)}
                          className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue"
                        >
                          <option value="Low">Low (Needs high guidance)</option>
                          <option value="Medium">Medium (Comfortable with basic UI)</option>
                          <option value="High">High (Adopts new apps quickly)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Risk Tolerance</label>
                        <select
                          value={formRiskTolerance}
                          onChange={e => setFormRiskTolerance(e.target.value)}
                          className="w-full border border-ml-border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue"
                        >
                          <option value="Risk-averse">Risk-averse (Needs reviews, trials)</option>
                          <option value="Neutral">Neutral (Standard behavior)</option>
                          <option value="Risk-seeking">Risk-seeking (Happy to try early products)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Buying Behavior (One per line)</label>
                        <textarea
                          rows={3}
                          value={formBuying}
                          onChange={e => setFormBuying(e.target.value)}
                          className="w-full border border-ml-border p-2.5 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[10px]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Hard Decision Rules (One per line)</label>
                        <textarea
                          rows={3}
                          value={formRules}
                          onChange={e => setFormRules(e.target.value)}
                          className="w-full border border-ml-border p-2.5 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[10px]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Media & Discovery Channels (One per line)</label>
                      <textarea
                        rows={2}
                        value={formChannels}
                        onChange={e => setFormChannels(e.target.value)}
                        className="w-full border border-ml-border p-2.5 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[10px]"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 5: PRODUCT FIT & JOURNEY MAP */}
                {wizardStep === 'journey' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h4 className="text-[11px] font-black uppercase text-ml-blue tracking-wide border-b border-ml-border pb-1">Product Feature Fit</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ml-success uppercase tracking-wider block">Must-Have Features</label>
                        <textarea
                          rows={2}
                          value={formMustHaves}
                          onChange={e => setFormMustHaves(e.target.value)}
                          className="w-full border border-ml-border p-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[10px]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ml-danger uppercase tracking-wider block">Deal-Breakers (Anti-features)</label>
                        <textarea
                          rows={2}
                          value={formDealBreakers}
                          onChange={e => setFormDealBreakers(e.target.value)}
                          className="w-full border border-ml-border p-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[10px]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Nice-to-Have Features</label>
                        <textarea
                          rows={2}
                          value={formNiceToHaves}
                          onChange={e => setFormNiceToHaves(e.target.value)}
                          className="w-full border border-ml-border p-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[10px]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Competitors & Alternatives</label>
                        <textarea
                          rows={2}
                          value={formAlternatives}
                          onChange={e => setFormAlternatives(e.target.value)}
                          className="w-full border border-ml-border p-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[10px]"
                        />
                      </div>
                    </div>

                    <h4 className="text-[11px] font-black uppercase text-ml-blue tracking-wide border-b border-ml-border pt-4 pb-1">Customer Journey Map (CJM) Stages</h4>
                    <div className="space-y-3 bg-ml-surface/20 p-4 rounded-xl border border-ml-border/60">
                      {journeyStages.map((stageItem, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center border-b border-ml-border/40 pb-3 last:border-b-0 last:pb-0">
                          <span className="text-[10px] font-black uppercase text-ml-ink shrink-0 block">{stageItem.stage}</span>
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={stageItem.goals}
                              onChange={e => handleJourneyStageChange(index, 'goals', e.target.value)}
                              placeholder="Goals (comma separated)"
                              className="w-full border border-ml-border px-2 py-1.5 rounded-lg bg-white text-[11px] focus:outline-none focus:ring-1 focus:ring-ml-blue"
                            />
                          </div>
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={stageItem.pain_points}
                              onChange={e => handleJourneyStageChange(index, 'pain_points', e.target.value)}
                              placeholder="Pain points"
                              className="w-full border border-ml-border px-2 py-1.5 rounded-lg bg-white text-[11px] focus:outline-none focus:ring-1 focus:ring-ml-blue"
                            />
                          </div>
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={stageItem.touchpoints}
                              onChange={e => handleJourneyStageChange(index, 'touchpoints', e.target.value)}
                              placeholder="Touchpoints"
                              className="w-full border border-ml-border px-2 py-1.5 rounded-lg bg-white text-[11px] focus:outline-none focus:ring-1 focus:ring-ml-blue"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 6: TRUST & VALIDATION */}
                {wizardStep === 'validation' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h4 className="text-[11px] font-black uppercase text-ml-blue tracking-wide border-b border-ml-border pb-1">Confidence Metrics & Evidence</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block flex items-center justify-between">
                          <span>Confidence Score</span>
                          <span className="text-ml-blue text-xs font-black">{formConfidence}%</span>
                        </label>
                        <p className="text-[10px] text-ml-ink-muted font-medium">Evaluate the confidence of these synthetic findings based on current research files.</p>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={formConfidence}
                          onChange={e => setFormConfidence(Number(e.target.value))}
                          className="w-full h-1.5 bg-ml-border rounded-lg appearance-none cursor-pointer accent-ml-blue"
                        />
                      </div>

                      <div className="bg-ml-surface/40 p-4 rounded-xl border border-ml-border flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider block text-ml-ink flex items-center gap-1.5">
                            <CheckCircle2 size={14} className={formIsHumanValidated ? 'text-ml-success' : 'text-ml-ink-muted'} />
                            Human Validated Status
                          </span>
                          <span className="text-[10px] text-ml-ink-muted font-medium block">Has this simulated segment been confirmed with real human research data?</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={formIsHumanValidated} 
                            onChange={e => setFormIsHumanValidated(e.target.checked)} 
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-ml-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-ml-success"></div>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Evidence Sources (Reports, CRM, Review links, one per line)</label>
                      <textarea
                        rows={3}
                        placeholder="e.g. EdTech Market Survey 2026 (50 students)&#10;Google Play competitor review analysis"
                        value={formEvidence}
                        onChange={e => setFormEvidence(e.target.value)}
                        className="w-full border border-ml-border p-2.5 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[10px]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider block">Synthetic Assumptions (Inferred elements requiring test, one per line)</label>
                      <textarea
                        rows={3}
                        value={formAssumptions}
                        onChange={e => setFormAssumptions(e.target.value)}
                        className="w-full border border-ml-border p-2.5 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-ml-blue font-mono text-[10px]"
                      />
                    </div>
                  </div>
                )}

                {/* Wizard Navigation Footer */}
                <div className="flex items-center justify-between border-t border-ml-border/60 pt-4 shrink-0 mt-6 bg-white">
                  <div>
                    {wizardStep !== 'identity' ? (
                      <button
                        type="button"
                        onClick={() => {
                          const steps: WizardStep[] = ['identity', 'jtbd', 'barriers', 'behavior', 'journey', 'validation'];
                          const currentIdx = steps.indexOf(wizardStep);
                          setWizardStep(steps[currentIdx - 1]);
                        }}
                        className="flex items-center gap-1 px-4 py-2 border border-ml-border hover:bg-ml-surface text-ml-ink text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        <ChevronLeft size={14} />
                        BACK
                      </button>
                    ) : (
                      <div />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {wizardStep !== 'validation' ? (
                      <button
                        type="button"
                        onClick={() => {
                          const steps: WizardStep[] = ['identity', 'jtbd', 'barriers', 'behavior', 'journey', 'validation'];
                          const currentIdx = steps.indexOf(wizardStep);
                          setWizardStep(steps[currentIdx + 1]);
                        }}
                        className="flex items-center gap-1 px-4 py-2 bg-ml-surface hover:bg-ml-border/50 text-ml-ink text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        CONTINUE
                        <ChevronRight size={14} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 py-2 px-6 bg-ml-blue hover:bg-ml-blue-strong text-white text-xs font-black rounded-lg transition-colors cursor-pointer shadow-md"
                      >
                        <Save size={14} />
                        SAVE PROFILE
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Limitation Notice / Warning banner */}
      <div className="rounded-xl border border-ml-warning/20 bg-amber-50/45 p-4 flex items-start gap-4 shadow-sm glass-panel">
        <div className="p-2.5 rounded-lg bg-amber-100/80 text-ml-warning border border-ml-warning/15 shrink-0 mt-0.5">
          <ShieldAlert size={22} />
        </div>
        <div className="space-y-1 text-xs">
          <h3 className="font-black text-ml-warning uppercase tracking-wider flex items-center gap-1.5">
            Synthetic Persona Simulation Disclaimer
          </h3>
          <p className="text-ml-ink-muted leading-relaxed font-semibold">
            These personas represent simulated research segments. Their Jobs-to-be-Done (JTBD), journey maps, and objections are structured parameters configured for synthetic panels. While helpful for early positioning validation, always verify key insights with human validation surveys.
          </p>
        </div>
      </div>

      {personas.length === 0 ? (
        <div className="text-center py-28 bg-white border border-ml-border border-dashed rounded-2xl space-y-4 shadow-xs">
          <Compass size={48} className="mx-auto text-ml-border animate-pulse" />
          <h3 className="text-sm font-bold uppercase tracking-wider">No Personas Profiled</h3>
          <p className="text-xs text-ml-ink-muted max-w-sm mx-auto font-medium">Create manual personas using the button in the top right to define your segment hypotheses.</p>
        </div>
      ) : (
        /* Persona Cards Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {personas.map((persona) => {
            const activeTab = cardTabs[persona.id] || 'overview';
            
            // Theme styling based on persona ID / segment
            let cardThemeClass = 'border-ml-border/60 hover:border-emerald-300';
            let headerBg = 'bg-emerald-50/40';
            let badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-200';
            let activeTabClass = 'border-emerald-600 text-emerald-700 bg-emerald-50/30';
            let scoreColor = 'text-emerald-700';

            if (persona.id.includes('career') || persona.segment.toLowerCase().includes('career') || persona.segment.toLowerCase().includes('corporate')) {
              cardThemeClass = 'border-ml-border/60 hover:border-ml-blue/30';
              headerBg = 'bg-ml-blue-soft/20';
              badgeBg = 'bg-ml-blue-soft text-ml-blue-strong border-ml-blue/15';
              activeTabClass = 'border-ml-blue text-ml-blue-strong bg-ml-blue-soft/10';
              scoreColor = 'text-ml-blue-strong';
            } else if (persona.id.includes('casual') || persona.segment.toLowerCase().includes('casual') || persona.segment.toLowerCase().includes('subtitle')) {
              cardThemeClass = 'border-ml-border/60 hover:border-amber-300';
              headerBg = 'bg-amber-50/30';
              badgeBg = 'bg-amber-100 text-amber-800 border-amber-200';
              activeTabClass = 'border-amber-600 text-amber-700 bg-amber-50/20';
              scoreColor = 'text-amber-700';
            }

            return (
              <div
                key={persona.id}
                className={`flex flex-col rounded-2xl border bg-white shadow-xs overflow-hidden transition-all duration-300 hover:shadow-lg relative group ${cardThemeClass}`}
              >
                
                {/* Stepper CRUD overlay */}
                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 z-20">
                  <button
                    onClick={() => handleStartEdit(persona)}
                    className="p-2 bg-white/90 border border-ml-border hover:bg-ml-surface hover:text-ml-blue text-ml-ink-muted rounded-lg shadow-sm transition-all cursor-pointer"
                    title="Edit Persona"
                  >
                    <Edit size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(persona.id)}
                    className="p-2 bg-white/90 border border-ml-border hover:bg-ml-surface hover:text-ml-danger text-ml-ink-muted rounded-lg shadow-sm transition-all cursor-pointer"
                    title="Delete Persona"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Card Header */}
                <div className={`p-6 ${headerBg} border-b border-ml-border`}>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-md border uppercase tracking-wider ${badgeBg}`}>
                      {persona.segment}
                    </span>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-ml-ink-muted font-bold flex items-center gap-1 uppercase tracking-wider">
                        <Award size={11} />
                        Confidence
                      </span>
                      <span className={`text-xs font-black ${scoreColor}`}>{persona.confidence_score}%</span>
                    </div>
                  </div>

                  <h2 className="text-[20px] font-black text-ml-ink tracking-tight uppercase leading-tight pr-14">{persona.name}</h2>
                  
                  {/* Demographics indicators */}
                  {persona.demographics && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {persona.demographics.map((demo, idx) => {
                        const val = demo.includes(':') ? demo.split(':')[1]?.trim() : demo;
                        return (
                          <span key={idx} className="text-[9px] px-2 py-0.5 bg-white border border-ml-border/60 rounded text-ml-ink-muted font-bold uppercase tracking-wide">
                            {val}
                          </span>
                        );
                      })}
                      {persona.validation?.is_human_validated && (
                        <span className="text-[9px] px-2 py-0.5 bg-ml-success/10 border border-ml-success/20 rounded text-ml-success font-black uppercase flex items-center gap-0.5 tracking-wide">
                          <Check size={9} /> HUMAN VALID
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Quote block */}
                <div className="p-4 border-b border-ml-border/40 bg-ml-surface/20 flex gap-2">
                  <Quote size={18} className="text-ml-blue shrink-0 mt-0.5" />
                  <p className="text-[11px] italic text-ml-ink-muted leading-relaxed font-semibold">
                    "{persona.quote}"
                  </p>
                </div>

                {/* Interactive Card Nav tabs */}
                <div className="flex border-b border-ml-border/50 bg-ml-surface/10 text-[9px] font-black uppercase tracking-wider text-ml-ink-muted shrink-0 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => toggleTab(persona.id, 'overview')}
                    className={`flex-1 text-center py-2.5 border-b-2 transition-all ${
                      activeTab === 'overview' ? activeTabClass : 'border-transparent hover:text-ml-ink'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleTab(persona.id, 'jtbd')}
                    className={`flex-1 text-center py-2.5 border-b-2 transition-all ${
                      activeTab === 'jtbd' ? activeTabClass : 'border-transparent hover:text-ml-ink'
                    }`}
                  >
                    JTBD & Fit
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleTab(persona.id, 'journey')}
                    className={`flex-1 text-center py-2.5 border-b-2 transition-all ${
                      activeTab === 'journey' ? activeTabClass : 'border-transparent hover:text-ml-ink'
                    }`}
                  >
                    Journey
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleTab(persona.id, 'fit')}
                    className={`flex-1 text-center py-2.5 border-b-2 transition-all ${
                      activeTab === 'fit' ? activeTabClass : 'border-transparent hover:text-ml-ink'
                    }`}
                  >
                    Validation
                  </button>
                </div>

                {/* Card Body - Content panels */}
                <div className="p-6 flex-1 space-y-4 overflow-y-auto max-h-[380px] min-h-[300px]">
                  
                  {/* TAB 1: OVERVIEW */}
                  {activeTab === 'overview' && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      {persona.goals && persona.goals.length > 0 && (
                        <div className="space-y-1.5">
                          <h3 className="text-[10px] font-black text-ml-success uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-ml-success" />
                            Key Goals
                          </h3>
                          <ul className="space-y-1">
                            {persona.goals.map((g, idx) => (
                              <li key={idx} className="text-xs text-ml-ink font-semibold leading-relaxed pl-3 relative before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:bg-ml-success before:rounded-full">
                                {g}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {persona.pain_points && persona.pain_points.length > 0 && (
                        <div className="space-y-1.5">
                          <h3 className="text-[10px] font-black text-ml-danger uppercase tracking-wider flex items-center gap-1.5">
                            <AlertTriangle size={13} className="text-ml-danger" />
                            Pain Points
                          </h3>
                          <ul className="space-y-1">
                            {persona.pain_points.map((p, idx) => (
                              <li key={idx} className="text-xs text-ml-ink font-semibold leading-relaxed pl-3 relative before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:bg-ml-danger before:rounded-full">
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {persona.objections && persona.objections.length > 0 && (
                        <div className="space-y-1.5">
                          <h3 className="text-[10px] font-black text-ml-warning uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldAlert size={13} className="text-ml-warning" />
                            Primary Objections
                          </h3>
                          <ul className="space-y-1">
                            {persona.objections.map((o, idx) => (
                              <li key={idx} className="text-xs text-ml-ink font-semibold leading-relaxed pl-3 relative before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:bg-ml-warning before:rounded-full">
                                {o}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: JTBD & FIT */}
                  {activeTab === 'jtbd' && (
                    <div className="space-y-4 animate-in fade-in duration-150 text-xs">
                      {persona.jtbd ? (
                        <div className="space-y-3">
                          <div className="border-l-2 border-ml-blue pl-2.5">
                            <span className="text-[9px] font-black uppercase text-ml-blue tracking-wider block">Functional Job</span>
                            <p className="text-[11px] font-bold text-ml-ink mt-0.5 leading-relaxed">{persona.jtbd.functional_job}</p>
                          </div>
                          <div className="border-l-2 border-ml-success pl-2.5">
                            <span className="text-[9px] font-black uppercase text-ml-success tracking-wider block">Emotional Job</span>
                            <p className="text-[11px] font-bold text-ml-ink mt-0.5 leading-relaxed">{persona.jtbd.emotional_job}</p>
                          </div>
                          <div className="border-l-2 border-ml-warning pl-2.5">
                            <span className="text-[9px] font-black uppercase text-ml-warning tracking-wider block">Social Job</span>
                            <p className="text-[11px] font-bold text-ml-ink mt-0.5 leading-relaxed">{persona.jtbd.social_job}</p>
                          </div>
                          {persona.jtbd.success_criteria && persona.jtbd.success_criteria.length > 0 && (
                            <div className="pt-1.5">
                              <span className="text-[9px] font-black uppercase text-ml-ink-muted tracking-wider block mb-1">Success Criteria</span>
                              <div className="flex flex-wrap gap-1">
                                {persona.jtbd.success_criteria.map((sc, idx) => (
                                  <span key={idx} className="text-[9px] px-2 py-0.5 bg-ml-surface border border-ml-border rounded font-bold text-ml-ink-muted uppercase">
                                    ✓ {sc}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-ml-ink-muted">
                          <Compass className="mx-auto text-ml-border mb-1" size={20} />
                          <span className="text-[10px] font-bold">No structured JTBD mapped yet. Edit this persona to add Jobs-to-be-Done.</span>
                        </div>
                      )}

                      {/* Must haves vs alternatives */}
                      {persona.product_fit && (
                        <div className="grid grid-cols-2 gap-3 border-t border-ml-border/40 pt-3">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase text-ml-success tracking-wider block">Must-Haves</span>
                            <div className="text-[10px] text-ml-ink font-semibold leading-relaxed space-y-0.5">
                              {persona.product_fit.must_haves.slice(0, 3).map((item, idx) => (
                                <div key={idx}>• {item}</div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase text-ml-danger tracking-wider block">Deal-Breakers</span>
                            <div className="text-[10px] text-ml-ink font-semibold leading-relaxed space-y-0.5">
                              {persona.product_fit.deal_breakers.slice(0, 3).map((item, idx) => (
                                <div key={idx}>• {item}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: JOURNEY MAP */}
                  {activeTab === 'journey' && (
                    <div className="space-y-3.5 animate-in fade-in duration-150 text-xs">
                      {persona.journey_map && persona.journey_map.length > 0 ? (
                        <div className="relative border-l border-ml-border pl-4 ml-1 space-y-4">
                          {persona.journey_map.map((stage, idx) => (
                            <div key={idx} className="relative">
                              {/* Step dot */}
                              <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-ml-blue border border-white"></div>
                              <span className="text-[9px] font-black uppercase text-ml-blue tracking-wider block">{stage.stage}</span>
                              <div className="space-y-0.5 mt-0.5 font-bold text-[10px]">
                                <div className="text-ml-ink"><span className="text-ml-ink-muted">Goal:</span> {stage.goals.join(', ')}</div>
                                <div className="text-ml-danger/90"><span className="text-ml-ink-muted">Barrier:</span> {stage.pain_points.join(', ')}</div>
                                <div className="text-ml-ink-muted text-[9px] italic font-semibold">{stage.touchpoints.join(', ')}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-ml-ink-muted">
                          <Activity className="mx-auto text-ml-border mb-1" size={20} />
                          <span className="text-[10px] font-bold">No journey path defined. Edit to configure Awareness &rarr; Retention steps.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: TRUST & VALIDATION */}
                  {activeTab === 'fit' && (
                    <div className="space-y-4 animate-in fade-in duration-150 text-xs">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between border-b border-ml-border/40 pb-2">
                          <span className="text-[10px] font-black uppercase text-ml-ink-muted tracking-wider block">Human Verification</span>
                          {persona.validation?.is_human_validated ? (
                            <span className="px-2 py-0.5 bg-ml-success/15 text-ml-success font-black text-[9px] rounded uppercase tracking-wider border border-ml-success/10">
                              ✓ Verified
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-ml-surface text-ml-ink-muted font-black text-[9px] rounded uppercase tracking-wider border border-ml-border">
                              Simulated
                            </span>
                          )}
                        </div>
                        
                        {persona.validation?.evidence_sources && persona.validation.evidence_sources.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase text-ml-ink-muted tracking-wider block">Evidence Sources</span>
                            <ul className="space-y-1 text-[10px] text-ml-ink font-semibold">
                              {persona.validation.evidence_sources.map((src, idx) => (
                                <li key={idx} className="pl-3 relative before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:bg-ml-ink-muted before:rounded-full">
                                  {src}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {persona.validation?.last_validated_at && (
                          <div className="text-[9px] text-ml-ink-muted font-bold pt-1.5 flex items-center gap-1 uppercase">
                            <Clock size={11} /> Last Validation: {new Date(persona.validation.last_validated_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      {/* Decision rules & buying style */}
                      {persona.psychographics && (
                        <div className="border-t border-ml-border/40 pt-3 space-y-2">
                          <span className="text-[10px] font-black uppercase text-ml-ink-muted tracking-wider block">Decision Profile</span>
                          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                            <div className="bg-ml-surface/40 p-2 rounded border border-ml-border/60">
                              <span className="text-[8px] font-black uppercase text-ml-ink-muted block">Risk Tolerance</span>
                              <span className="text-ml-ink uppercase">{persona.psychographics.risk_tolerance}</span>
                            </div>
                            <div className="bg-ml-surface/40 p-2 rounded border border-ml-border/60">
                              <span className="text-[8px] font-black uppercase text-ml-ink-muted block">Tech Savviness</span>
                              <span className="text-ml-ink uppercase">{persona.psychographics.tech_savviness}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Assumptions */}
                      {persona.assumptions && persona.assumptions.length > 0 && (
                        <div className="border-t border-ml-border/40 pt-3">
                          <span className="text-[9px] font-black uppercase text-ml-ink-muted tracking-wider block mb-2">Synthetic Assumptions</span>
                          <div className="flex flex-wrap gap-1">
                            {persona.assumptions.map((ass, idx) => (
                              <span key={idx} className="text-[9px] px-2 py-0.5 bg-ml-blue-soft border border-ml-blue/15 rounded text-ml-blue-strong font-bold">
                                {ass}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
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
