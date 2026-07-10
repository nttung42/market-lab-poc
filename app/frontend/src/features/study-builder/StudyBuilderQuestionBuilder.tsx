import { ClipboardList, HelpCircle, Plus, Trash2 } from 'lucide-react';
import type { Study } from '../../types';
import type { NewQuestionState } from './studyBuilder.types';
import { isChoiceQuestion } from './studyBuilder.utils';

interface StudyBuilderQuestionBuilderProps {
  activeStudy: Study;
  newQuestion: NewQuestionState;
  onQuestionChange: (nextQuestion: NewQuestionState) => void;
  onAddQuestion: () => void;
  onAddOptionField: () => void;
  onRemoveOptionField: (index: number) => void;
}

export const StudyBuilderQuestionBuilder = ({
  activeStudy,
  newQuestion,
  onQuestionChange,
  onAddQuestion,
  onAddOptionField,
  onRemoveOptionField,
}: StudyBuilderQuestionBuilderProps) => {
  const updateOption = (index: number, value: string) => {
    const nextOptions = [...newQuestion.options];
    nextOptions[index] = value;
    onQuestionChange({ ...newQuestion, options: nextOptions });
  };

  const questionCount = activeStudy.questions?.length || 0;
  const disableAddQuestion =
    !newQuestion.text.trim() ||
    (isChoiceQuestion(newQuestion.type) &&
      newQuestion.options.filter((option) => option.trim()).length < 2);

  return (
    <div className="space-y-6 lg:col-span-2">
      <div className="space-y-6 rounded-lg border border-ml-border bg-white p-6">
        <h2 className="flex items-center gap-2 border-b border-ml-border pb-3 text-sm font-black uppercase tracking-wider">
          <ClipboardList size={18} className="text-ml-blue" />
          Câu hỏi nghiên cứu ({questionCount})
        </h2>

        {questionCount > 0 ? (
          <div className="space-y-4">
            {[...(activeStudy.questions || [])]
              .sort((a, b) => a.position - b.position)
              .map((question, index) => (
                <div
                  key={question.id}
                  className="group relative space-y-3 rounded-lg border border-ml-border bg-ml-surface/40 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="rounded border border-ml-blue/10 bg-ml-blue-soft px-2 py-0.5 text-[10px] font-bold uppercase text-ml-blue">
                        Câu {index + 1} • {question.type.replace('_', ' ')}
                      </span>
                      <h3 className="text-sm font-bold leading-relaxed">{question.text}</h3>
                    </div>
                  </div>

                  {question.options && question.options.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
                      {question.options.map((option) => (
                        <div
                          key={option.id}
                          className="rounded border border-ml-border/60 bg-white px-3 py-1.5 text-xs font-medium text-ml-ink-muted"
                        >
                          <span className="mr-1 font-bold text-ml-ink">
                            {option.value.toUpperCase()}:
                          </span>
                          {option.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-2 rounded-lg border border-dashed border-ml-border bg-ml-surface/20 py-12 text-center text-ml-ink-muted">
            <HelpCircle size={28} className="mx-auto text-ml-border" />
            <p className="text-xs font-bold uppercase tracking-wider">Chưa có câu hỏi nào</p>
            <p className="mx-auto max-w-xs text-xs text-ml-ink-muted">
              Hãy dùng khung bên dưới để tạo và thêm câu hỏi khảo sát đầu tiên.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-5 rounded-lg border border-ml-border bg-white p-6">
        <h2 className="flex items-center gap-2 border-b border-ml-border pb-3 text-sm font-black uppercase tracking-wider">
          <Plus size={18} className="text-ml-blue" />
          Thêm câu hỏi
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="sm:col-span-1">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ml-ink-muted">
                Loại câu hỏi
              </label>
              <select
                value={newQuestion.type}
                onChange={(event) =>
                  onQuestionChange({
                    ...newQuestion,
                    type: event.target.value as NewQuestionState['type'],
                    options: isChoiceQuestion(
                      event.target.value as NewQuestionState['type'],
                    )
                      ? ['', '']
                      : [],
                  })
                }
                className="w-full rounded-lg border border-ml-border bg-white px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-ml-blue"
              >
                <option value="single_choice">Một lựa chọn</option>
                <option value="multi_choice">Nhiều lựa chọn</option>
                <option value="likert">Thang Likert</option>
                <option value="open_text">Câu trả lời mở</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ml-ink-muted">
                Nội dung câu hỏi
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Gói giá nào phù hợp với ngân sách của bạn?"
                value={newQuestion.text}
                onChange={(event) =>
                  onQuestionChange({ ...newQuestion, text: event.target.value })
                }
                className="w-full rounded-lg border border-ml-border bg-white px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ml-blue"
              />
            </div>
          </div>

          {isChoiceQuestion(newQuestion.type) && (
            <div className="space-y-2.5 rounded-lg border border-ml-border bg-ml-surface/30 p-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-ml-ink-muted">
                  Các lựa chọn
                </label>
                <button
                  type="button"
                  onClick={onAddOptionField}
                  className="flex items-center gap-0.5 text-[10px] font-bold uppercase text-ml-blue hover:underline"
                >
                  <Plus size={10} />
                  Thêm lựa chọn
                </button>
              </div>

              <div className="space-y-2">
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-xs font-mono text-ml-ink-muted">
                      {index + 1}.
                    </span>
                    <input
                      type="text"
                      placeholder={`Nội dung lựa chọn ${index + 1}...`}
                      value={option}
                      onChange={(event) => updateOption(index, event.target.value)}
                      className="flex-1 rounded border border-ml-border bg-white px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ml-blue"
                    />
                    {newQuestion.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => onRemoveOptionField(index)}
                        className="rounded p-1.5 text-ml-danger transition-colors hover:bg-ml-danger/10"
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
            onClick={onAddQuestion}
            disabled={disableAddQuestion}
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-ml-ink px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-ml-ink-muted disabled:bg-ml-border"
          >
            <Plus size={14} />
            THÊM VÀO KHẢO SÁT
          </button>
        </div>
      </div>
    </div>
  );
};
