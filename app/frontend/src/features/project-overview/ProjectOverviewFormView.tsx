import { Edit, Plus, RefreshCw, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { workspaceSuggestions } from './projectOverview.constants';
import { projectStudyTypeOptions } from './projectOverview.utils';
import type {
  ProjectFormValues,
  ProjectOverviewMode,
  WorkspaceSuggestion,
} from './projectOverview.types';

interface ProjectOverviewFormViewProps {
  activeProjectId: string | null;
  mode: Extract<ProjectOverviewMode, 'create' | 'edit'>;
  loading: boolean;
  saving: boolean;
  values: ProjectFormValues;
  onChange: (nextValues: ProjectFormValues) => void;
  onApplySuggestion: (suggestion: WorkspaceSuggestion) => void;
  onReset: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSelectProject: (projectId: string | null) => void;
  onClose?: () => void;
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

const FormField = ({ label, children }: FieldProps) => (
  <div className="space-y-1">
    <label className="block text-[10px] font-bold uppercase tracking-wider text-ml-ink-muted">
      {label}
    </label>
    {children}
  </div>
);

const inputClassName =
  'w-full rounded-lg border border-ml-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ml-blue';

export const ProjectOverviewFormView = ({
  activeProjectId,
  mode,
  loading,
  saving,
  values,
  onChange,
  onApplySuggestion,
  onReset,
  onSubmit,
  onSelectProject,
  onClose,
}: ProjectOverviewFormViewProps) => {
  if (loading && mode === 'edit') {
    return (
      <div className="w-full space-y-8 p-8 animate-pulse">
        <div className="h-8 w-2/3 rounded-lg bg-ml-border" />
        <div className="h-64 rounded-lg bg-ml-border" />
      </div>
    );
  }

  const cancel = () => {
    if (onClose) {
      onClose();
      return;
    }

    if (mode === 'edit' && activeProjectId) {
      onSelectProject(activeProjectId);
      return;
    }

    onSelectProject(null);
  };

  return (
    <div className="flex max-h-full w-full flex-col overflow-y-auto p-5 text-ml-ink md:p-6">
      <div className="flex items-center justify-between border-b border-ml-border/60 pb-4">
        <h2 className="flex items-center gap-1.5 text-sm font-black uppercase tracking-wider">
          {mode === 'edit' ? (
            <Edit className="text-ml-blue" size={16} />
          ) : (
            <Plus className="text-ml-blue" size={16} />
          )}
          {mode === 'edit'
            ? 'Chỉnh sửa không gian nghiên cứu'
            : 'Khởi tạo không gian nghiên cứu'}
        </h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-ml-ink-muted transition-colors hover:bg-ml-surface cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="pt-5">
        <form onSubmit={onSubmit} className="space-y-4 text-xs font-medium">
          {mode === 'create' && (
            <div className="space-y-2 rounded-lg border border-ml-border bg-ml-surface/60 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-ml-ink-muted">
                    Gợi ý điền nhanh
                  </div>
                  <p className="mt-1 text-[11px] font-medium text-ml-ink-muted">
                    Chọn một mẫu để tự động điền biểu mẫu.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onReset}
                  className="shrink-0 rounded-md border border-ml-border bg-white px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ml-ink transition-colors hover:border-ml-blue/40 hover:text-ml-blue cursor-pointer"
                >
                  Xóa trắng
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {workspaceSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.label}
                    type="button"
                    onClick={() => onApplySuggestion(suggestion)}
                    className="rounded-full border border-ml-border bg-white px-3 py-2 text-left transition-colors hover:border-ml-blue/40 hover:bg-ml-blue-soft/20 cursor-pointer"
                  >
                    <div className="text-[11px] font-black uppercase tracking-wider text-ml-ink">
                      {suggestion.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <FormField label="Tên sản phẩm / concept">
            <input
              type="text"
              placeholder="Ví dụ: Trợ lý luyện tiếng Anh công việc bằng AI"
              value={values.name}
              onChange={(event) =>
                onChange({ ...values, name: event.target.value })
              }
              className={inputClassName}
              required
            />
          </FormField>

          <FormField label="Mô tả sản phẩm">
            <textarea
              placeholder="Sản phẩm làm gì và tạo giá trị gì cho người dùng?"
              value={values.product_description}
              onChange={(event) =>
                onChange({
                  ...values,
                  product_description: event.target.value,
                })
              }
              rows={3}
              className={`${inputClassName} resize-none`}
              required
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Ngành">
              <input
                type="text"
                placeholder="Ví dụ: EdTech, SaaS"
                value={values.industry}
                onChange={(event) =>
                  onChange({ ...values, industry: event.target.value })
                }
                className={inputClassName}
                required
              />
            </FormField>
            <FormField label="Thị trường / khu vực">
              <input
                type="text"
                placeholder="Ví dụ: Việt Nam, Đông Nam Á"
                value={values.market}
                onChange={(event) =>
                  onChange({ ...values, market: event.target.value })
                }
                className={inputClassName}
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Đối tượng mục tiêu">
              <input
                type="text"
                placeholder="Ví dụ: Sinh viên đại học, nhân sự mới đi làm"
                value={values.target_audience}
                onChange={(event) =>
                  onChange({
                    ...values,
                    target_audience: event.target.value,
                  })
                }
                className={inputClassName}
                required
              />
            </FormField>

            <FormField label="Mục tiêu nghiên cứu">
              <input
                type="text"
                placeholder="Ví dụ: Chọn hướng thông điệp mạnh hơn"
                value={values.research_objective}
                onChange={(event) =>
                  onChange({
                    ...values,
                    research_objective: event.target.value,
                  })
                }
                className={inputClassName}
                required
              />
            </FormField>
          </div>

          <FormField label="Phương pháp nghiên cứu">
            <select
              value={values.study_type}
              onChange={(event) =>
                onChange({ ...values, study_type: event.target.value })
              }
              className={inputClassName}
            >
              {projectStudyTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormField>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={cancel}
              className="flex-1 rounded-lg border border-ml-border px-4 py-3 text-center text-xs font-bold text-ml-ink transition-colors hover:bg-ml-surface cursor-pointer"
            >
              HỦY
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-ml-blue px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-ml-blue-strong disabled:bg-ml-border cursor-pointer"
            >
              {saving ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : mode === 'edit' ? (
                'CẬP NHẬT DỰ ÁN'
              ) : (
                'KHỞI TẠO DỰ ÁN'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
