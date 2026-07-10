import { personaTabs } from './personaCatalog.constants';
import type { PersonaTab } from './personaCatalog.types';

interface PersonaSubNavProps {
  activeTab: PersonaTab;
  onChange: (tab: PersonaTab) => void;
}

export const PersonaSubNav = ({ activeTab, onChange }: PersonaSubNavProps) => (
  <div className="flex flex-col gap-1 rounded-lg border border-ml-border bg-white p-1 md:flex-row md:items-center">
    {personaTabs.map((tab) => {
      const isActive = activeTab === tab.id;

      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 text-xs font-black uppercase tracking-wide transition-colors ${
            isActive
              ? 'bg-ml-blue text-white shadow-sm'
              : 'text-ml-ink-muted hover:bg-ml-surface hover:text-ml-ink'
          }`}
        >
          {tab.label}
          {tab.note && (
            <span
              className={`rounded px-1.5 py-0.5 text-[9px] font-black ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-ml-surface text-ml-ink-muted'
              }`}
            >
              {tab.note}
            </span>
          )}
        </button>
      );
    })}
  </div>
);
