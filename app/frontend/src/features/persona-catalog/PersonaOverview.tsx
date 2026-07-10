import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { personaCreationOptions } from './personaCatalog.constants';
import type { PersonaTab } from './personaCatalog.types';

interface PersonaOverviewProps {
  onSelect: (tab: PersonaTab) => void;
}

export const PersonaOverview = ({ onSelect }: PersonaOverviewProps) => {
  const [selectedCard, setSelectedCard] =
    useState<Exclude<PersonaTab, 'overview'>>('research');

  const selectedOption =
    personaCreationOptions.find((option) => option.id === selectedCard) ||
    personaCreationOptions[0];
  const SelectedIcon = selectedOption.icon;

  return (
    <div className="space-y-8">
      <div className="pt-3">
        <div className="text-xs font-black uppercase tracking-[0.18em] text-ml-blue">
          Khung tạo persona
        </div>
        <h1 className="mt-4 text-[28px] font-black leading-tight tracking-normal text-ml-ink md:text-[40px]">
          4 loại persona cho nghiên cứu mô phỏng
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {personaCreationOptions.map((option) => {
          const isSelected = selectedCard === option.id;
          const Icon = option.icon;

          return (
            <article
              key={`${option.title}-${option.id}`}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedCard(option.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedCard(option.id);
                }
              }}
              className={`flex min-h-[300px] cursor-pointer flex-col rounded-lg border p-5 outline-none transition-all duration-200 select-none hover:-translate-y-1 hover:shadow-md ${
                isSelected
                  ? 'border-ml-blue bg-ml-blue-soft/10 shadow-md ring-2 ring-ml-blue/10'
                  : 'border-ml-border hover:border-ml-blue/40'
              }`}
            >
              <span
                className={`self-start rounded-md px-3 py-2 text-xs font-black uppercase tracking-wide ${option.badgeClass}`}
              >
                {option.eyebrow}
              </span>
              <div className="mt-5 flex items-start gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${option.iconClass}`}
                >
                  <Icon size={26} />
                </div>
                <div>
                  <h2 className="text-lg font-black leading-tight text-ml-ink">
                    {option.title}
                  </h2>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wide text-ml-ink-muted">
                    {option.subtitle}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm font-medium leading-relaxed text-ml-ink">
                {option.description}
              </p>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedCard(option.id);
                }}
                className={`mt-auto h-11 w-full rounded-md border text-sm font-black transition-colors ${
                  isSelected
                    ? 'border-ml-blue bg-ml-blue text-white'
                    : 'border-ml-border bg-white text-ml-blue hover:border-ml-blue/30 hover:bg-ml-blue-soft/30'
                }`}
              >
                Xem chi tiết
              </button>
            </article>
          );
        })}
      </div>

      <section className="rounded-lg border border-ml-border bg-white p-6 md:p-7">
        <div className="flex flex-col gap-4 border-b border-ml-border pb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md ${selectedOption.iconClass}`}
            >
              <SelectedIcon size={26} />
            </div>
            <div>
              <div
                className={`inline-flex rounded-md px-3 py-1.5 text-[10px] font-black uppercase tracking-wide ${selectedOption.badgeClass}`}
              >
                {selectedOption.eyebrow}
              </div>
              <h2 className="mt-3 text-2xl font-black text-ml-ink">
                {selectedOption.title}
              </h2>
              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-ml-ink-muted">
                {selectedOption.subtitle}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <div className="max-w-xs rounded-lg border border-ml-blue/20 bg-ml-blue-soft/50 px-4 py-3 text-xs font-bold leading-5 text-ml-blue">
              Dùng các tab phía trên để mở không gian làm việc chi tiết cho từng loại persona.
            </div>
            <button
              type="button"
              onClick={() => onSelect(selectedCard)}
              className="flex h-11 items-center justify-center gap-2 rounded-md bg-ml-blue px-5 text-xs font-black uppercase tracking-wide text-white transition-colors hover:bg-ml-blue-strong"
            >
              <span>Mở không gian làm việc</span>
              <ExternalLink size={14} />
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-5">
            <div className="rounded-lg border border-ml-border bg-ml-surface/40 p-4">
              <div className="text-[10px] font-black uppercase tracking-wide text-ml-ink-muted">
                {selectedOption.learnMore.sourceLabel}
              </div>
              <ul className="mt-3 space-y-2">
                {selectedOption.learnMore.sourceItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm font-medium leading-6 text-ml-ink"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ml-blue" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedOption.learnMore.features && (
              <div className="rounded-lg border border-ml-border bg-white p-4">
                <div className="text-[10px] font-black uppercase tracking-wide text-ml-ink-muted">
                  Tính năng
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedOption.learnMore.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-md border border-ml-border bg-ml-surface px-2.5 py-1 text-[11px] font-bold text-ml-ink"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-ml-border bg-white p-4">
              <div className="text-[10px] font-black uppercase tracking-wide text-ml-ink-muted">
                Mục đích
              </div>
              <p className="mt-3 text-sm font-medium leading-6 text-ml-ink">
                {selectedOption.learnMore.purpose}
              </p>
            </div>

            <div className="rounded-lg border border-ml-border bg-white p-4">
              <div className="text-[10px] font-black uppercase tracking-wide text-ml-ink-muted">
                Ví dụ đầu ra
              </div>
              <p className="mt-3 text-sm font-medium leading-6 text-ml-ink">
                {selectedOption.learnMore.exampleOutput}
              </p>
            </div>

            {selectedOption.learnMore.note && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium leading-6 text-ml-warning">
                {selectedOption.learnMore.note}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
