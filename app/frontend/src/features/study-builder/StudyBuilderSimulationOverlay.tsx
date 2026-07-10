import { Loader2 } from 'lucide-react';

interface StudyBuilderSimulationOverlayProps {
  simProgress: number;
  simStatusText: string;
  selectedPersonaCount: number;
}

export const StudyBuilderSimulationOverlay = ({
  simProgress,
  simStatusText,
  selectedPersonaCount,
}: StudyBuilderSimulationOverlayProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-ml-ink/80 p-6 backdrop-blur-xs">
    <div className="w-full max-w-md space-y-6 rounded-lg border border-ml-border bg-white p-8 text-center shadow-xl">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ml-blue-soft text-ml-blue">
        <Loader2 size={32} className="animate-spin" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-bold uppercase tracking-wide">
          Phiên chạy nghiên cứu mô phỏng
        </h3>
        <p className="text-sm font-semibold text-ml-blue">{simStatusText}</p>
      </div>
      <div className="space-y-1">
        <div className="h-3 w-full overflow-hidden rounded-full border border-ml-border bg-ml-surface">
          <div
            className="h-full bg-ml-blue transition-all duration-300 ease-out"
            style={{ width: `${simProgress}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-bold text-ml-ink-muted">
          <span>0%</span>
          <span>{simProgress}%</span>
          <span>100%</span>
        </div>
      </div>
      <div className="rounded border border-ml-border bg-ml-surface p-4 text-left">
        <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-ml-ink-muted">
          Nhật ký thực thi
        </div>
        <div className="max-h-24 space-y-0.5 overflow-y-auto text-[11px] font-mono leading-relaxed text-ml-ink">
          <div className="text-ml-success">✔ Đã khởi tạo mô phỏng nghiên cứu</div>
          <div>✔ Đã lấy {selectedPersonaCount} chân dung mục tiêu</div>
          <div>✔ Đã tìm thấy 15 người tham gia mô phỏng</div>
          {simProgress > 20 && <div>▶ Đang gửi tác vụ tới các nhóm ảo...</div>}
          {simProgress > 50 && (
            <div className="text-ml-success">✔ Đã lưu phản hồi mô phỏng</div>
          )}
          {simProgress > 80 && <div>▶ Đang trích xuất kết quả và tóm tắt...</div>}
        </div>
      </div>
    </div>
  </div>
);
