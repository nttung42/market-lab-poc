import {
  ChevronDown,
  CircleHelp,
  ExternalLink,
  FlaskConical,
  LogOut,
  Settings,
  UserCircle,
  X,
} from 'lucide-react';
import { Link } from 'react-router';
import type { Project } from '../../types';
import { QuickSidebarLink } from './QuickSidebarLink';
import {
  appRoutes,
  currentUserInitial,
  currentUserName,
} from './workspaceShell.constants';
import type { SidebarItem, SidebarSection } from './workspaceShell.types';

interface WorkspaceSidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  activeProjectName: string;
  homeItem: SidebarItem;
  projectItem: SidebarItem;
  sidebarSections: SidebarSection[];
  showWorkspaceDropdown: boolean;
  showUserMenu: boolean;
  workspaceDropdownRef: React.RefObject<HTMLDivElement | null>;
  userMenuRef: React.RefObject<HTMLDivElement | null>;
  onToggleWorkspaceDropdown: () => void;
  onToggleUserMenu: () => void;
  onCloseUserMenu: () => void;
  onCloseMobileSidebar: () => void;
  onOpenProjectDirectory: () => void;
  onOpenProjectDetail: (projectId: string) => void;
  onOpenCreateProject: () => void;
  onLogout: () => void;
}

export const WorkspaceSidebar = ({
  projects,
  activeProjectId,
  activeProjectName,
  homeItem,
  projectItem,
  sidebarSections,
  showWorkspaceDropdown,
  showUserMenu,
  workspaceDropdownRef,
  userMenuRef,
  onToggleWorkspaceDropdown,
  onToggleUserMenu,
  onCloseUserMenu,
  onCloseMobileSidebar,
  onOpenProjectDirectory,
  onOpenProjectDetail,
  onOpenCreateProject,
  onLogout,
}: WorkspaceSidebarProps) => (
  <div className="flex h-full flex-col">
    <div className="border-b border-ml-border/70 px-4 py-4">
      <div className="flex items-center justify-between">
        <Link
          to={appRoutes.landing}
          className="inline-flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ml-blue text-white shadow-sm">
            <FlaskConical size={22} strokeWidth={2.4} />
          </span>
          <span className="text-xl font-black leading-none tracking-tight">
            <span className="text-ml-blue">MARKET</span>
            <span className="text-ml-ink">LAB</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={onCloseMobileSidebar}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ml-border bg-white text-ml-ink-muted transition-colors hover:border-ml-blue/20 hover:text-ml-blue lg:hidden"
          aria-label="Đóng thanh điều hướng"
        >
          <X size={16} />
        </button>
      </div>
    </div>

    <div className="px-4 py-4">
      <div ref={workspaceDropdownRef} className="relative">
        <button
          type="button"
          onClick={onToggleWorkspaceDropdown}
          className="w-full cursor-pointer rounded-xl border border-ml-border bg-white p-3 text-left shadow-xs transition-all hover:border-ml-blue/30"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-ml-blue to-ml-blue-strong text-xs font-black text-white shadow-xs">
              {activeProjectName.slice(0, 2).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-extrabold leading-tight text-ml-ink">
                {activeProjectName}
              </span>
              <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-wider text-ml-ink-muted">
                {activeProjectId ? 'Project workspace' : 'Select project'}
              </span>
            </span>
            <ChevronDown
              size={14}
              className={`shrink-0 text-ml-ink-muted transition-transform duration-200 ${
                showWorkspaceDropdown ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {showWorkspaceDropdown && (
          <div className="absolute left-0 right-0 top-full z-20 mt-1.5 rounded-xl border border-ml-border bg-white p-1.5 shadow-md">
            <button
              onClick={onOpenProjectDirectory}
              className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-xs font-bold text-ml-ink transition-colors hover:bg-ml-surface"
            >
              📁 Danh sách dự án
            </button>
            <div className="my-1 max-h-48 space-y-0.5 overflow-y-auto">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => onOpenProjectDetail(project.id)}
                  className={`w-full cursor-pointer rounded-lg px-3 py-2 text-left transition-colors ${
                    activeProjectId === project.id
                      ? 'bg-ml-blue-soft/60 text-ml-blue'
                      : 'text-ml-ink hover:bg-ml-surface'
                  }`}
                >
                  <div className="truncate text-xs font-bold">💼 {project.name}</div>
                  <div className="mt-0.5 truncate text-[9px] font-black uppercase tracking-wider text-ml-ink-muted/75">
                    {project.industry}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onOpenCreateProject}
        className="mt-3 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ml-blue to-ml-blue-strong text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:opacity-95"
      >
        <span className="text-lg leading-none">+</span>
        Tạo dự án mới
      </button>
    </div>

    <nav className="flex-1 overflow-y-auto px-3 pb-4">
      <div className="space-y-2">
        <QuickSidebarLink item={homeItem} />
        <QuickSidebarLink item={projectItem} fallbackDisabled={!activeProjectId && projectItem.kind === 'route'} />
      </div>

      <div className="mt-5 space-y-5">
        {sidebarSections.map((section) => (
          <section key={section.id}>
            <div className="px-3 pb-1.5 text-[9px] font-black uppercase tracking-widest text-ml-ink-muted/60">
              {section.label}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => (
                <QuickSidebarLink
                  key={item.id}
                  item={item}
                  fallbackDisabled={!activeProjectId && item.kind === 'route'}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </nav>

    <div className="border-t border-ml-border/70 px-4 py-4">
      <a
        href="https://github.com"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-ml-ink-muted transition-colors hover:bg-white hover:text-ml-blue"
      >
        <CircleHelp size={15} />
        Trợ giúp & tài liệu
        <ExternalLink size={11} className="ml-auto" />
      </a>

      <div ref={userMenuRef} className="relative mt-2">
        <button
          onClick={onToggleUserMenu}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-ml-border bg-white px-3 py-2 text-left shadow-xs transition-all hover:border-ml-blue/30"
          aria-expanded={showUserMenu}
          aria-haspopup="menu"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-ml-blue to-ml-blue-strong text-xs font-black text-white shadow-xs">
            {currentUserInitial}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-bold leading-tight text-ml-ink">
              Xin chào, {currentUserName}
            </span>
            <span className="mt-0.5 block truncate text-[9px] font-black uppercase tracking-wider text-ml-ink-muted">
              marketlab@local
            </span>
          </span>
          <span className="shrink-0 text-xs leading-none text-ml-ink-muted">▼</span>
        </button>

        {showUserMenu && (
          <div
            className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-ml-border bg-white p-1.5 shadow-md"
            role="menu"
          >
            <button
              onClick={onCloseUserMenu}
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-ml-ink transition-colors hover:bg-ml-surface"
              role="menuitem"
            >
              <UserCircle size={14} />
              Tài khoản
            </button>
            <button
              onClick={onCloseUserMenu}
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-ml-ink transition-colors hover:bg-ml-surface"
              role="menuitem"
            >
              <Settings size={14} />
              Cài đặt
            </button>
            <button
              onClick={onLogout}
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-ml-danger transition-colors hover:bg-red-50"
              role="menuitem"
            >
              <LogOut size={14} />
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);
