import { AlertTriangle, Play, Sparkles } from 'lucide-react';
import type { Persona, Study } from '../../types';

interface StudyBuilderSidebarProps {
  personas: Persona[];
  selectedPersonas: string[];
  activeStudy: Study;
  onTogglePersona: (personaId: string) => void;
  onRunSimulation: () => void;
}

export const StudyBuilderSidebar = ({
  personas,
  selectedPersonas,
  activeStudy,
  onTogglePersona,
  onRunSimulation,
}: StudyBuilderSidebarProps) => (
  <div className="space-y-6">
    <div className="space-y-6 rounded-lg border border-ml-border bg-white p-6">
      <div className="space-y-1">
        <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider">
          <Sparkles size={18} className="text-ml-blue" />
          Chọn nhóm mục tiêu
        </h2>
        <p className="text-[11px] font-medium text-ml-ink-muted">
          Chọn các chân dung sẽ tham gia vào phiên mô phỏng nghiên cứu.
        </p>
      </div>

      <div className="space-y-3 border-t border-ml-border pt-4">
        {personas.map((persona) => {
          const isChecked = selectedPersonas.includes(persona.id);
          return (
            <label
              key={persona.id}
              className="flex cursor-pointer select-none items-start gap-3 rounded-lg border border-ml-border p-2.5 transition-colors hover:bg-ml-surface/40"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onTogglePersona(persona.id)}
                className="mt-0.5 h-4 w-4 rounded border-ml-border text-ml-blue focus:ring-ml-blue focus:ring-offset-0"
              />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-ml-ink">{persona.name}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-ml-ink-muted">
                  {persona.segment}
                </div>
                <div className="text-[10px] font-semibold text-ml-blue">
                  Quy mô nhóm: 5 người mô phỏng
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {selectedPersonas.length === 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-ml-danger/20 bg-ml-danger/10 p-3 text-ml-danger">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span className="text-[10px] font-semibold leading-relaxed">
            Vui lòng chọn ít nhất một nhóm chân dung để tham gia mô phỏng.
          </span>
        </div>
      )}
    </div>

    <div className="space-y-6 rounded-lg border border-ml-border bg-white p-6">
      <div className="space-y-1">
        <h2 className="text-sm font-black uppercase tracking-wider">
          Khởi chạy mô phỏng
        </h2>
        <p className="text-[11px] font-medium text-ml-ink-muted">
          Chi phí ước tính: ~0.02 USD (mô phỏng mẫu là miễn phí và offline)
        </p>
      </div>

      <div className="space-y-3.5 border-t border-ml-border pt-4 text-xs font-medium leading-relaxed text-ml-ink-muted">
        <div className="flex justify-between border-b border-ml-border/50 pb-1.5">
          <span className="font-bold">Tổng số người tham gia:</span>
          <span className="font-bold text-ml-ink">{selectedPersonas.length * 5}</span>
        </div>
        <div className="flex justify-between border-b border-ml-border/50 pb-1.5">
          <span className="font-bold">Tổng số câu hỏi:</span>
          <span className="font-bold text-ml-ink">
            {activeStudy.questions?.length || 0}
          </span>
        </div>
        <div className="flex justify-between border-b border-ml-border/50 pb-1.5">
          <span className="font-bold">Bộ máy mô hình:</span>
          <span className="font-bold text-ml-blue">
            Rule-engine mô phỏng dự phòng
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onRunSimulation}
        disabled={selectedPersonas.length === 0 || !activeStudy.questions || activeStudy.questions.length === 0}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-ml-blue px-4 py-3 text-xs font-bold text-white shadow-xs transition-colors duration-150 hover:bg-ml-blue-strong disabled:bg-ml-border"
      >
        <Play size={14} fill="currentColor" />
        CHẠY MÔ PHỎNG
      </button>
    </div>
  </div>
);
