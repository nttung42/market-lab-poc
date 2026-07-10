import type { WeightedSignal } from '../../types';
import { clampWeight } from './personaCatalog.utils';
import type { PersonaSectionProps } from './personaCatalog.types';

export const Section = ({
  title,
  icon,
  children,
  className = '',
}: PersonaSectionProps) => (
  <section className={`rounded-lg border border-ml-border bg-white p-5 ${className}`}>
    <div className="mb-4 flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-ml-blue-soft text-ml-blue-strong">
        {icon}
      </div>
      <h2 className="text-sm font-black uppercase tracking-wide text-ml-ink">{title}</h2>
    </div>
    {children}
  </section>
);

export const BulletList = ({
  items = [],
  tone = 'blue',
}: {
  items?: string[];
  tone?: 'blue' | 'green' | 'amber' | 'red';
}) => {
  const colorMap = {
    blue: 'bg-ml-blue',
    green: 'bg-ml-success',
    amber: 'bg-ml-warning',
    red: 'bg-ml-danger',
  };

  if (items.length === 0) {
    return (
      <p className="text-xs font-semibold text-ml-ink-muted">
        Chưa có tín hiệu nào được ánh xạ.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="relative pl-4 text-sm font-medium leading-relaxed text-ml-ink"
        >
          <span
            className={`absolute left-0 top-2 h-1.5 w-1.5 rounded-full ${colorMap[tone]}`}
          />
          {item}
        </li>
      ))}
    </ul>
  );
};

export const SignalBars = ({
  signals = [],
  limit = 6,
}: {
  signals?: WeightedSignal[];
  limit?: number;
}) => {
  const visible = signals.slice(0, limit);

  if (visible.length === 0) {
    return (
      <p className="text-xs font-semibold text-ml-ink-muted">
        Chưa có tín hiệu trọng số nào được ánh xạ.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {visible.map((signal, index) => (
        <div key={`${signal.label}-${index}`} className="space-y-1">
          <div className="flex items-center justify-between gap-3 text-xs font-bold">
            <span className="truncate text-ml-ink">{signal.label}</span>
            <span className="tabular-nums text-ml-ink-muted">
              {clampWeight(signal.weight)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-ml-surface">
            <div
              className="h-full rounded-full bg-ml-blue"
              style={{ width: `${clampWeight(signal.weight)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export const Chips = ({
  items = [],
  limit = 12,
}: {
  items?: string[];
  limit?: number;
}) => {
  const visible = items.slice(0, limit);

  if (visible.length === 0) {
    return (
      <p className="text-xs font-semibold text-ml-ink-muted">
        Chưa có thẻ nào được ánh xạ.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="rounded-md border border-ml-border bg-ml-surface px-2.5 py-1 text-[11px] font-bold text-ml-ink-muted"
        >
          {item}
        </span>
      ))}
    </div>
  );
};

export const KeyValueGrid = ({
  items,
}: {
  items: { label: string; value?: string | number | null }[];
}) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
    {items.map((item) => (
      <div
        key={item.label}
        className="rounded-md border border-ml-border bg-ml-surface/40 p-3"
      >
        <div className="text-[10px] font-black uppercase tracking-wide text-ml-ink-muted">
          {item.label}
        </div>
        <div className="mt-1 text-sm font-bold text-ml-ink">
          {item.value || 'Không xác định'}
        </div>
      </div>
    ))}
  </div>
);

export const IndustrySignals = ({
  title,
  groups = {},
}: {
  title: string;
  groups?: Record<string, WeightedSignal[]>;
}) => {
  const entries = Object.entries(groups).filter(([, signals]) => signals.length > 0);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {entries.map(([group, signals]) => (
          <div
            key={group}
            className="rounded-md border border-ml-border bg-ml-surface/30 p-3"
          >
            <div className="mb-2 text-[11px] font-black uppercase tracking-wide text-ml-ink">
              {group.replaceAll('_', ' ')}
            </div>
            <SignalBars signals={signals} limit={4} />
          </div>
        ))}
      </div>
    </div>
  );
};
