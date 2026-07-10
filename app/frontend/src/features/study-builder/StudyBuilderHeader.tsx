import { Check, Edit, Loader2, Plus, Trash2, X } from 'lucide-react';
import type { FormEvent } from 'react';
import type { Study } from '../../types';
import { studyStatusLabel } from './studyBuilder.utils';

interface StudyBuilderHeaderProps {
  studies: Study[];
  activeStudy: Study | null;
  isEditingStudyTitle: boolean;
  editedStudyTitle: string;
  newStudyTitle: string;
  savingStudy: boolean;
  onEditedStudyTitleChange: (value: string) => void;
  onNewStudyTitleChange: (value: string) => void;
  onSelectStudy: (studyId: string) => void;
  onStartRename: () => void;
  onConfirmRename: () => void;
  onCancelRename: () => void;
  onDeleteActiveStudy: () => void;
  onCreateStudy: (event: FormEvent<HTMLFormElement>) => void;
}

export const StudyBuilderHeader = ({
  studies,
  activeStudy,
  isEditingStudyTitle,
  editedStudyTitle,
  newStudyTitle,
  savingStudy,
  onEditedStudyTitleChange,
  onNewStudyTitleChange,
  onSelectStudy,
  onStartRename,
  onConfirmRename,
  onCancelRename,
  onDeleteActiveStudy,
  onCreateStudy,
}: StudyBuilderHeaderProps) => (
  <div className="flex flex-col justify-between gap-6 rounded-lg border border-ml-border border-l-4 border-l-ml-blue bg-white p-6 shadow-xs md:flex-row md:items-center">
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="rounded bg-ml-blue px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          MVP giai đoạn 1
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-ml-ink-muted">
          Khám phá thông điệp
        </span>
      </div>
      <h1 className="text-2xl font-black uppercase tracking-tight">Trình tạo nghiên cứu</h1>
      <p className="text-xs font-medium text-ml-ink-muted">
        Thiết kế khảo sát và chạy kiểm thử concept với các nhóm mô phỏng.
      </p>
    </div>

    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
      {isEditingStudyTitle ? (
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={editedStudyTitle}
            onChange={(event) => onEditedStudyTitleChange(event.target.value)}
            className="rounded-lg border border-ml-border bg-white px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-ml-blue"
          />
          <button
            onClick={onConfirmRename}
            className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 transition-colors hover:bg-emerald-100 cursor-pointer"
            title="Lưu tiêu đề"
          >
            <Check size={14} />
          </button>
          <button
            onClick={onCancelRename}
            className="rounded-lg border border-gray-200 bg-gray-50 p-2 text-gray-700 transition-colors hover:bg-gray-100 cursor-pointer"
            title="Hủy"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <select
              value={activeStudy?.id || ''}
              onChange={(event) => onSelectStudy(event.target.value)}
              className="cursor-pointer appearance-none rounded-lg border border-ml-border bg-white px-4 py-2 pr-8 text-xs font-bold text-ml-ink focus:outline-none focus:ring-1 focus:ring-ml-blue"
            >
              <option value="" disabled>
                Chọn nghiên cứu...
              </option>
              {studies.map((study) => (
                <option key={study.id} value={study.id}>
                  {study.title} ({studyStatusLabel(study.status)})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ml-ink-muted">
              ▼
            </div>
          </div>
          {activeStudy && (
            <>
              <button
                onClick={onStartRename}
                className="rounded-lg border border-ml-border p-2 text-ml-ink-muted transition-colors hover:bg-ml-surface hover:text-ml-blue cursor-pointer"
                title="Đổi tên nghiên cứu"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={onDeleteActiveStudy}
                className="rounded-lg border border-ml-border p-2 text-ml-ink-muted transition-colors hover:bg-ml-surface hover:text-ml-danger cursor-pointer"
                title="Xóa nghiên cứu"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      )}

      <form onSubmit={onCreateStudy} className="flex gap-1.5">
        <input
          type="text"
          placeholder="Tên nghiên cứu mới..."
          value={newStudyTitle}
          onChange={(event) => onNewStudyTitleChange(event.target.value)}
          className="w-full rounded-lg border border-ml-border bg-white px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ml-blue sm:w-44"
        />
        <button
          type="submit"
          disabled={savingStudy || !newStudyTitle.trim()}
          className="flex cursor-pointer items-center gap-1 rounded-lg bg-ml-ink px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-ml-ink-muted disabled:bg-ml-border"
        >
          {savingStudy ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Plus size={14} />
          )}
          TẠO
        </button>
      </form>
    </div>
  </div>
);
