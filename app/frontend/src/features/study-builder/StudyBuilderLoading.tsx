import { Loader2 } from 'lucide-react';

export const StudyBuilderLoading = () => (
  <div className="flex flex-1 flex-col items-center justify-center py-24">
    <Loader2 size={36} className="mb-4 animate-spin text-ml-blue" />
    <p className="text-xs font-semibold uppercase tracking-widest text-ml-ink-muted">
      Đang tải trình tạo nghiên cứu...
    </p>
  </div>
);
