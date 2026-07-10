import { HelpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  addQuestion,
  createStudy,
  deleteStudy,
  getProjectPersonas,
  getProjectStudies,
  runStudy,
  updateStudy,
} from '../api/client';
import { StudyBuilderHeader } from '../features/study-builder/StudyBuilderHeader';
import { StudyBuilderLoading } from '../features/study-builder/StudyBuilderLoading';
import { StudyBuilderQuestionBuilder } from '../features/study-builder/StudyBuilderQuestionBuilder';
import { StudyBuilderSidebar } from '../features/study-builder/StudyBuilderSidebar';
import { StudyBuilderSimulationOverlay } from '../features/study-builder/StudyBuilderSimulationOverlay';
import type { NewQuestionState } from '../features/study-builder/studyBuilder.types';
import { isChoiceQuestion } from '../features/study-builder/studyBuilder.utils';
import type { Persona, Study } from '../types';

interface StudyBuilderProps {
  projectId: string;
  onNavigateToResults: (studyId: string) => void;
}

export const StudyBuilder = ({
  projectId,
  onNavigateToResults,
}: StudyBuilderProps) => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [activeStudy, setActiveStudy] = useState<Study | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
  const [newStudyTitle, setNewStudyTitle] = useState('');
  const [newQuestion, setNewQuestion] = useState<NewQuestionState>({
    text: '',
    type: 'single_choice',
    options: ['', ''],
  });
  const [loading, setLoading] = useState(true);
  const [savingStudy, setSavingStudy] = useState(false);
  const [runningSim, setRunningSim] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [simStatusText, setSimStatusText] = useState('');
  const [isEditingStudyTitle, setIsEditingStudyTitle] = useState(false);
  const [editedStudyTitle, setEditedStudyTitle] = useState('');

  useEffect(() => {
    void loadInitialData();
  }, [projectId]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [studiesData, personasData] = await Promise.all([
        getProjectStudies(projectId),
        getProjectPersonas(projectId),
      ]);
      setStudies(studiesData);
      setPersonas(personasData);
      setSelectedPersonas(personasData.map((persona) => persona.id));

      const completed = studiesData.find((study) => study.status === 'completed');
      const draft = studiesData.find((study) => study.status === 'draft');
      setActiveStudy(completed || draft || studiesData[0] || null);
    } catch (error) {
      console.error('Không thể tải dữ liệu ban đầu', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActiveStudy = async () => {
    if (!activeStudy) {
      return;
    }

    if (
      !confirm(
        `Bạn có chắc muốn xóa nghiên cứu "${activeStudy.title}"? Thao tác này sẽ xóa vĩnh viễn toàn bộ phản hồi mô phỏng.`,
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await deleteStudy(activeStudy.id);
      const nextStudies = studies.filter((study) => study.id !== activeStudy.id);
      setStudies(nextStudies);
      setActiveStudy(nextStudies[0] || null);
    } catch (error) {
      console.error('Không thể xóa nghiên cứu', error);
      alert('Không thể xóa nghiên cứu.');
    } finally {
      setLoading(false);
    }
  };

  const handleRenameActiveStudy = async () => {
    if (!activeStudy || !editedStudyTitle.trim()) {
      return;
    }

    try {
      const updated = await updateStudy(activeStudy.id, editedStudyTitle.trim());
      setStudies((current) =>
        current.map((study) =>
          study.id === activeStudy.id ? { ...study, title: updated.title } : study,
        ),
      );
      setActiveStudy((current) =>
        current ? { ...current, title: updated.title } : null,
      );
      setIsEditingStudyTitle(false);
    } catch (error) {
      console.error('Không thể đổi tên nghiên cứu', error);
      alert('Không thể đổi tên nghiên cứu.');
    }
  };

  const handleCreateStudy = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newStudyTitle.trim()) {
      return;
    }

    setSavingStudy(true);
    try {
      const study = await createStudy(projectId, newStudyTitle);
      setStudies((current) => [study, ...current]);
      setActiveStudy(study);
      setNewStudyTitle('');
    } catch (error) {
      console.error('Không thể tạo nghiên cứu', error);
    } finally {
      setSavingStudy(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!activeStudy || !newQuestion.text.trim()) {
      return;
    }

    const questionId = `q-${Date.now()}`;
    const formattedOptions = isChoiceQuestion(newQuestion.type)
      ? newQuestion.options
          .filter((option) => option.trim() !== '')
          .map((option, index) => ({
            id: `opt-${index}-${Date.now()}`,
            text: option,
            value: option.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          }))
      : [];

    const questionData = {
      id: questionId,
      text: newQuestion.text,
      type: newQuestion.type,
      position: (activeStudy.questions?.length || 0) + 1,
      options: formattedOptions,
    };

    try {
      await addQuestion(activeStudy.id, questionData);
      await loadInitialData();
      setNewQuestion({
        text: '',
        type: 'single_choice',
        options: ['', ''],
      });
    } catch (error) {
      console.error('Không thể thêm câu hỏi', error);
    }
  };

  const handleRunSimulation = async () => {
    if (!activeStudy) {
      return;
    }

    setRunningSim(true);
    setSimProgress(5);
    setSimStatusText('Đang khởi tạo nhóm mô phỏng...');

    const interval = setInterval(() => {
      setSimProgress((current) => {
        if (current >= 90) {
          clearInterval(interval);
          return 90;
        }

        const step = Math.random() > 0.5 ? 15 : 5;
        if (current > 70) {
          setSimStatusText('Đang tổng hợp insight và khuyến nghị...');
        } else if (current > 40) {
          setSimStatusText('Đang mô phỏng quy tắc ra quyết định...');
        } else if (current > 20) {
          setSimStatusText('Đang mô phỏng sở thích theo nhóm...');
        }
        return current + step;
      });
    }, 400);

    try {
      await runStudy(activeStudy.id, selectedPersonas);
      clearInterval(interval);
      setSimProgress(100);
      setSimStatusText('Mô phỏng hoàn tất!');
      setTimeout(() => {
        setRunningSim(false);
        onNavigateToResults(activeStudy.id);
      }, 1000);
    } catch (error) {
      clearInterval(interval);
      setRunningSim(false);
      alert(
        'Chạy mô phỏng thất bại. Hãy kiểm tra rằng bạn đã tạo nhóm người tham gia trước.',
      );
    }
  };

  const addOptionField = () => {
    setNewQuestion((current) => ({
      ...current,
      options: [...current.options, ''],
    }));
  };

  const removeOptionField = (index: number) => {
    setNewQuestion((current) => ({
      ...current,
      options: current.options.filter((_, optionIndex) => optionIndex !== index),
    }));
  };

  const togglePersona = (personaId: string) => {
    setSelectedPersonas((current) =>
      current.includes(personaId)
        ? current.filter((id) => id !== personaId)
        : [...current, personaId],
    );
  };

  if (loading) {
    return <StudyBuilderLoading />;
  }

  return (
    <div className="mx-auto flex-1 w-full max-w-5xl space-y-6 px-6 py-6 text-ml-ink">
      {runningSim && (
        <StudyBuilderSimulationOverlay
          simProgress={simProgress}
          simStatusText={simStatusText}
          selectedPersonaCount={selectedPersonas.length}
        />
      )}

      <StudyBuilderHeader
        studies={studies}
        activeStudy={activeStudy}
        isEditingStudyTitle={isEditingStudyTitle}
        editedStudyTitle={editedStudyTitle}
        newStudyTitle={newStudyTitle}
        savingStudy={savingStudy}
        onEditedStudyTitleChange={setEditedStudyTitle}
        onNewStudyTitleChange={setNewStudyTitle}
        onSelectStudy={(studyId) =>
          setActiveStudy(studies.find((study) => study.id === studyId) || null)
        }
        onStartRename={() => {
          if (!activeStudy) {
            return;
          }
          setEditedStudyTitle(activeStudy.title);
          setIsEditingStudyTitle(true);
        }}
        onConfirmRename={handleRenameActiveStudy}
        onCancelRename={() => setIsEditingStudyTitle(false)}
        onDeleteActiveStudy={handleDeleteActiveStudy}
        onCreateStudy={handleCreateStudy}
      />

      {activeStudy ? (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <StudyBuilderQuestionBuilder
            activeStudy={activeStudy}
            newQuestion={newQuestion}
            onQuestionChange={setNewQuestion}
            onAddQuestion={handleAddQuestion}
            onAddOptionField={addOptionField}
            onRemoveOptionField={removeOptionField}
          />

          <StudyBuilderSidebar
            personas={personas}
            selectedPersonas={selectedPersonas}
            activeStudy={activeStudy}
            onTogglePersona={togglePersona}
            onRunSimulation={handleRunSimulation}
          />
        </div>
      ) : (
        <div className="space-y-3 rounded-lg border border-ml-border bg-white py-20 text-center">
          <HelpCircle size={36} className="mx-auto text-ml-border" />
          <h2 className="text-md font-bold uppercase tracking-wider">
            Chưa có nghiên cứu nào
          </h2>
          <p className="mx-auto max-w-sm text-xs text-ml-ink-muted">
            Hãy tạo một nghiên cứu khảo sát bằng biểu mẫu ở phần đầu để bắt đầu xây dựng câu hỏi.
          </p>
        </div>
      )}
    </div>
  );
};
