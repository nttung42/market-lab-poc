import {
  AlertTriangle,
  ExternalLink,
  Loader2,
  Lock,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react';
import type { FormEvent } from 'react';
import type { Persona } from '../../types';
import { EXAMPLE_PROMPTS, processingSteps } from './personaCatalog.constants';
import { PersonaDetail } from './PersonaDetail';

interface PersonaResearchWorkspaceProps {
  prompt: string;
  loading: boolean;
  generating: boolean;
  error: string | null;
  personas: Persona[];
  selectedPersona: Persona | null;
  onPromptChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSelectPersona: (personaId: string) => void;
}

export const PersonaResearchWorkspace = ({
  prompt,
  loading,
  generating,
  error,
  personas,
  selectedPersona,
  onPromptChange,
  onSubmit,
  onSelectPersona,
}: PersonaResearchWorkspaceProps) => (
  <>
    <div className="flex flex-col gap-4 border-b border-ml-border pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="inline-flex items-center gap-2 rounded-md border border-ml-blue/20 bg-ml-blue-soft px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-ml-blue-strong">
          <Sparkles size={13} />
          Trí tuệ persona
        </div>
        <h1 className="mt-3 text-[28px] font-black uppercase leading-tight tracking-normal md:text-[36px]">
          Trình tạo persona AI
        </h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-ml-ink-muted">
          Chỉ từ một mô tả đối tượng, hệ thống tạo ra hồ sơ persona mô phỏng có cấu trúc để kiểm thử thông điệp.
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs font-bold text-ml-ink-muted">
        <Lock size={14} className="text-ml-blue" />
        Kết quả chỉ đọc
      </div>
    </div>

    {error && (
      <div className="flex items-start gap-2 rounded-lg border border-ml-danger/20 bg-ml-danger/10 p-4 text-xs font-bold text-ml-danger">
        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
        <span>{error}</span>
      </div>
    )}

    {loading ? (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          <div className="h-80 rounded-lg bg-ml-border" />
          <div className="h-[620px] rounded-lg bg-ml-border" />
        </div>
      </div>
    ) : (
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-5 lg:sticky lg:top-32">
          <section className="rounded-lg border border-ml-border bg-white p-5">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="persona-prompt"
                  className="text-xs font-black uppercase tracking-wide text-ml-ink"
                >
                  Mô tả đối tượng
                </label>
                <textarea
                  id="persona-prompt"
                  value={prompt}
                  onChange={(event) => onPromptChange(event.target.value)}
                  rows={7}
                  className="mt-2 w-full resize-none rounded-md border border-ml-border bg-white px-3 py-3 text-sm font-medium leading-relaxed text-ml-ink outline-none transition focus:border-ml-blue focus:ring-2 focus:ring-ml-blue/20"
                  disabled={generating}
                />
              </div>
              <button
                type="submit"
                disabled={generating}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-ml-blue text-xs font-black uppercase tracking-wide text-white transition-colors hover:bg-ml-blue-strong disabled:bg-ml-border disabled:text-ml-ink-muted"
              >
                {generating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
                Tạo persona
              </button>
            </form>
          </section>

          <section className="rounded-lg border border-ml-border bg-white p-5">
            <h2 className="mb-3 text-xs font-black uppercase tracking-wide text-ml-ink">
              Gợi ý prompt
            </h2>
            <div className="space-y-2">
              {EXAMPLE_PROMPTS.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => onPromptChange(example)}
                  className="w-full rounded-md border border-ml-border p-3 text-left text-xs font-semibold leading-relaxed text-ml-ink-muted transition-colors hover:border-ml-blue hover:bg-ml-blue-soft/30"
                >
                  {example}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-ml-border bg-white p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-xs font-black uppercase tracking-wide text-ml-ink">
                Hồ sơ đã tạo
              </h2>
              <span className="text-[10px] font-black text-ml-blue">
                {personas.length}
              </span>
            </div>
            {personas.length === 0 ? (
              <div className="rounded-md border border-dashed border-ml-border p-4 text-center">
                <Search className="mx-auto mb-2 text-ml-ink-muted" size={20} />
                <p className="text-xs font-semibold text-ml-ink-muted">
                  Chưa có persona nào được tạo.
                </p>
              </div>
            ) : (
              <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
                {personas.map((persona) => (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => onSelectPersona(persona.id)}
                    className={`w-full rounded-md border p-3 text-left transition-colors ${
                      selectedPersona?.id === persona.id
                        ? 'border-ml-blue bg-ml-blue-soft/40'
                        : 'border-ml-border bg-white hover:border-ml-blue/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-black uppercase text-ml-ink">
                          {persona.name}
                        </div>
                        <div className="mt-0.5 truncate text-[11px] font-bold text-ml-ink-muted">
                          {persona.segment}
                        </div>
                      </div>
                      <ExternalLink size={14} className="mt-0.5 shrink-0 text-ml-ink-muted" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </aside>

        <main className="min-w-0">
          {generating ? (
            <section className="flex min-h-[620px] flex-col justify-center rounded-lg border border-ml-border bg-white p-8">
              <div className="mx-auto max-w-xl text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ml-blue-soft text-ml-blue">
                  <Loader2 size={34} className="animate-spin" />
                </div>
                <h2 className="mt-5 text-2xl font-black uppercase tracking-normal text-ml-ink">
                  Đang dựng persona
                </h2>
                <p className="mt-2 text-sm font-semibold text-ml-ink-muted">
                  Kết quả mô phỏng sẽ ở chế độ chỉ đọc và cần xác thực bằng người thật.
                </p>
                <div className="mt-8 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
                  {processingSteps.map((step, index) => (
                    <div
                      key={step}
                      className="flex items-center gap-3 rounded-md border border-ml-border bg-ml-surface/40 p-3"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-ml-blue text-xs font-black text-white">
                        {index + 1}
                      </div>
                      <span className="text-xs font-black uppercase tracking-wide text-ml-ink">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : selectedPersona ? (
            <PersonaDetail persona={selectedPersona} />
          ) : (
            <section className="flex min-h-[620px] items-center justify-center rounded-lg border border-ml-border bg-white p-8 text-center">
              <div className="max-w-md">
                <Zap className="mx-auto mb-4 text-ml-blue" size={42} />
                <h2 className="text-2xl font-black uppercase tracking-normal text-ml-ink">
                  Sẵn sàng tạo persona
                </h2>
                <p className="mt-2 text-sm font-semibold text-ml-ink-muted">
                  Hãy nhập mô tả đối tượng để tạo persona mô phỏng đầu tiên ở chế độ chỉ đọc.
                </p>
              </div>
            </section>
          )}
        </main>
      </div>
    )}
  </>
);
