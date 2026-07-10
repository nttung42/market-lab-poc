import { NavLink } from 'react-router';
import type { SidebarItem } from './workspaceShell.types';

const enabledNavClass =
  'group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-all duration-150 hover:bg-ml-surface/80';

interface QuickSidebarLinkProps {
  item: SidebarItem;
  fallbackDisabled?: boolean;
}

export const QuickSidebarLink = ({
  item,
  fallbackDisabled = false,
}: QuickSidebarLinkProps) => {
  const Icon = item.icon;
  const isDisabled = item.kind === 'disabled' || fallbackDisabled || item.enabled === false;

  if (isDisabled || !item.to) {
    return (
      <button
        type="button"
        disabled
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-ml-ink-muted/45"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ml-border bg-white/50">
          <Icon size={16} />
        </span>
        <span className="min-w-0 flex-1 text-sm font-semibold">{item.label}</span>
        {item.badge && (
          <span className="rounded-full border border-ml-border bg-white/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ml-ink-muted/60">
            {item.badge}
          </span>
        )}
      </button>
    );
  }

  return (
    <NavLink end={item.end} to={item.to} className={enabledNavClass}>
      {({ isActive }) => (
        <>
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
              isActive
                ? 'border-ml-blue/20 bg-ml-blue text-white shadow-xs'
                : 'border-transparent bg-white text-ml-ink-muted group-hover:text-ml-blue'
            }`}
          >
            <Icon size={16} />
          </span>
          <span
            className={`min-w-0 flex-1 text-sm font-semibold transition-colors ${
              isActive ? 'text-ml-blue' : 'text-ml-ink group-hover:text-ml-blue'
            }`}
          >
            {item.label}
          </span>
          {item.badge && (
            <span
              className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                isActive
                  ? 'bg-white/70 text-ml-blue'
                  : 'border border-ml-border bg-white text-ml-ink-muted'
              }`}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};
