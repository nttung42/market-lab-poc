import type { ReactNode } from 'react';

interface PersonaMockPanelProps {
  title: string;
  description: string;
  badge: string;
  icon: ReactNode;
  comingSoon?: boolean;
}

export const PersonaMockPanel = ({
  title,
  description,
  badge,
  icon,
  comingSoon = false,
}: PersonaMockPanelProps) => (
  <section className="overflow-hidden rounded-lg border border-ml-border bg-white">
    <div className="bg-ml-ink p-6 text-white md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-white text-ml-blue">
            {icon}
          </div>
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide">
              {badge}
            </div>
            <h1 className="mt-3 text-3xl font-black uppercase leading-tight tracking-normal md:text-4xl">
              {title}
            </h1>
          </div>
        </div>
        <span className="self-start rounded-md bg-ml-blue px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white md:self-center">
          Bản mô phỏng mẫu
        </span>
      </div>
      <p className="mt-5 max-w-3xl text-sm font-semibold leading-relaxed text-white/80 md:text-base">
        {description}
      </p>
    </div>

    <div className="grid grid-cols-1 gap-6 p-6 md:p-7 lg:grid-cols-[360px_1fr]">
      <div className="space-y-4">
        <div className="rounded-lg border border-ml-border bg-ml-surface/40 p-5">
          <h2 className="text-xs font-black uppercase tracking-wide text-ml-ink">
            Khung dữ liệu đầu vào
          </h2>
          <textarea
            rows={8}
            className="mt-3 w-full resize-none rounded-md border border-ml-border bg-white px-3 py-3 text-sm font-medium leading-relaxed text-ml-ink outline-none focus:border-ml-blue focus:ring-2 focus:ring-ml-blue/20"
            defaultValue="Mô tả phân khúc, bối cảnh mua hàng, rào cản, kết quả mong muốn và các kênh mà bạn muốn Market Lab mô phỏng."
            disabled={comingSoon}
          />
          <button
            type="button"
            disabled={comingSoon}
            className="mt-4 h-11 w-full rounded-md bg-ml-blue text-xs font-black uppercase tracking-wide text-white disabled:bg-ml-border disabled:text-ml-ink-muted"
          >
            {comingSoon ? 'Sắp ra mắt' : 'Tạo bản nháp'}
          </button>
        </div>
        <div className="rounded-lg border border-ml-warning/30 bg-amber-50 p-4 text-xs font-bold leading-relaxed text-ml-warning">
          Các bản nháp persona mô phỏng chỉ là giả định và cần được kiểm chứng bằng người thật trước khi dùng cho quyết định nghiên cứu.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {['Hồ sơ có cấu trúc', 'Tác nhân ra quyết định', 'Phản đối', 'Tín hiệu kênh'].map(
          (item) => (
            <div key={item} className="rounded-lg border border-ml-border bg-white p-5">
              <div className="text-[10px] font-black uppercase tracking-wide text-ml-ink-muted">
                {item}
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-ml-surface">
                <div className="h-full w-2/3 bg-ml-blue" />
              </div>
              <p className="mt-4 text-sm font-semibold leading-relaxed text-ml-ink-muted">
                Nội dung minh họa tạm thời sẽ được thay bằng dữ liệu của luồng persona tương ứng.
              </p>
            </div>
          ),
        )}
      </div>
    </div>
  </section>
);
