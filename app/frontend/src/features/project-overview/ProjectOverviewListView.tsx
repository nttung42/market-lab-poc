import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Edit,
  Folder,
  Plus,
  Trash2,
  Search,
  Clock,
  Users,
  Grid,
  List,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { Project } from '../../types';

interface ProjectOverviewListViewProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (projectId: string | null) => void;
  onCreateProject: () => void;
  onEditProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
}

export const ProjectOverviewListView = ({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onEditProject,
  onDeleteProject,
}: ProjectOverviewListViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuProjectId, setActiveMenuProjectId] = useState<string | null>(null);
  
  const menuRef = useRef<HTMLDivElement | null>(null);

  const itemsPerPage = 2;

  // Handle click outside of active actions dropdown menu
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuProjectId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.product_description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      statusFilter === 'Tất cả' ||
      (statusFilter === 'Đang hoạt động' && project.status === 'Đang hoạt động');

    return matchesSearch && matchesStatus;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    // Default newest (updated_at or created_at)
    const timeA = new Date(a.updated_at || a.created_at).getTime();
    const timeB = new Date(b.updated_at || b.created_at).getTime();
    return timeB - timeA;
  });

  // Paginate projects
  const totalItems = sortedProjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  // Keep page number valid after filters change
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedProjects = sortedProjects.slice(startIndex, endIndex);

  // Helper for gradient avatar style based on project name / avatar_text
  const getAvatarGradient = (project: Project) => {
    const avatar = project.avatar_text || project.name.trim().charAt(0).toUpperCase();
    if (avatar === 'EN') {
      return 'from-sky-400 via-blue-500 to-indigo-600';
    }
    if (avatar === 'SN') {
      return 'from-amber-400 via-orange-500 to-red-500';
    }
    return 'from-fuchsia-400 via-purple-500 to-indigo-600';
  };

  // Helper for industry badge color styling
  const getIndustryBadgeStyle = (industry: string) => {
    if (industry === 'EdTech') {
      return 'bg-blue-50 text-blue-700 border border-blue-100';
    }
    if (industry === 'Hàng tiêu dùng') {
      return 'bg-amber-50 text-amber-700 border border-amber-100';
    }
    return 'bg-slate-50 text-slate-700 border border-slate-200';
  };

  // Helper for relative updated time display
  const getRelativeTime = (updatedAt?: string) => {
    if (!updatedAt) return 'Cập nhật gần đây';
    const date = new Date(updatedAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return 'Cập nhật vừa xong';
    }
    if (diffHours < 24) {
      return `Cập nhật ${diffHours} giờ trước`;
    }
    if (diffHours < 48) {
      return 'Cập nhật hôm qua';
    }
    const diffDays = Math.floor(diffHours / 24);
    return `Cập nhật ${diffDays} ngày trước`;
  };

  return (
    <div className="mx-auto flex-1 w-full max-w-6xl space-y-6 px-6 py-6 text-ml-ink">
      {/* Top Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-ml-ink md:text-3xl">
            Dự án
            <span className="inline-flex items-center justify-center rounded-full bg-blue-50 text-ml-blue font-bold px-2.5 py-0.5 text-sm border border-blue-100">
              {projects.length}
            </span>
          </h1>
          <p className="mt-1 text-sm font-medium text-ml-ink-muted">
            Quản lý và tiếp tục các không gian nghiên cứu của bạn.
          </p>
        </div>
        <button
          onClick={onCreateProject}
          className="flex items-center gap-1.5 rounded-lg bg-ml-blue px-4 py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-ml-blue-strong cursor-pointer"
        >
          <Plus size={16} />
          Tạo dự án mới
        </button>
      </div>

      {/* Filter / Search Control Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-ml-border pb-4">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1 max-w-xs">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-ml-ink-muted/65" />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm dự án..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-ml-border bg-white py-2 pl-9 pr-4 text-sm outline-none transition-colors focus:border-ml-blue focus:ring-1 focus:ring-ml-blue"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-lg border border-ml-border bg-white py-2 pl-4 pr-10 text-sm outline-none cursor-pointer focus:border-ml-blue focus:ring-1 focus:ring-ml-blue"
            >
              <option value="Tất cả">Trạng thái: Tất cả</option>
              <option value="Đang hoạt động">Trạng thái: Đang hoạt động</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-ml-ink-muted">
              <span className="text-[10px]">▼</span>
            </div>
          </div>

          {/* Sort Control */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none rounded-lg border border-ml-border bg-white py-2 pl-4 pr-10 text-sm outline-none cursor-pointer focus:border-ml-blue focus:ring-1 focus:ring-ml-blue"
            >
              <option value="newest">Sắp xếp: Cập nhật gần nhất</option>
              <option value="name">Sắp xếp: Tên dự án A-Z</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-ml-ink-muted">
              <span className="text-[10px]">▼</span>
            </div>
          </div>
        </div>

        {/* View mode toggle switcher */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'border-ml-blue/30 bg-blue-50/50 text-ml-blue shadow-xs'
                : 'border-ml-border bg-white text-ml-ink-muted hover:text-ml-ink hover:border-ml-border-strong'
            }`}
            title="Dạng danh sách"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'border-ml-blue/30 bg-blue-50/50 text-ml-blue shadow-xs'
                : 'border-ml-border bg-white text-ml-ink-muted hover:text-ml-ink hover:border-ml-border-strong'
            }`}
            title="Dạng lưới"
          >
            <Grid size={16} />
          </button>
        </div>
      </div>

      {/* Main projects contents */}
      {paginatedProjects.length === 0 ? (
        <div className="space-y-4 rounded-xl border-2 border-dashed border-ml-border bg-white py-16 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-ml-blue">
            <Folder size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-ml-ink">
              Bạn chưa có dự án nào?
            </h3>
            <p className="mx-auto max-w-md text-xs text-ml-ink-muted leading-relaxed">
              Tạo không gian nghiên cứu đầu tiên để bắt đầu xây dựng persona và thực hiện nghiên cứu tổng hợp.
            </p>
          </div>
          <button
            onClick={onCreateProject}
            className="inline-flex items-center gap-1.5 rounded-lg bg-ml-blue px-4 py-2.5 text-xs font-bold text-white hover:bg-ml-blue-strong transition-colors cursor-pointer"
          >
            <Plus size={14} />
            Tạo dự án đầu tiên
          </button>
        </div>
      ) : viewMode === 'list' ? (
        /* List View rendering */
        <div className="space-y-4">
          {paginatedProjects.map((project) => {
            const isActive = activeProjectId === project.id;
            const showMenu = activeMenuProjectId === project.id;

            return (
              <article
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className={`group flex flex-col md:flex-row overflow-hidden rounded-xl border bg-white shadow-xs transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'border-ml-blue ring-1 ring-ml-blue/20 shadow-md'
                    : 'border-ml-border hover:border-ml-blue/40 hover:shadow-sm'
                }`}
              >
                {/* Left side gradient block */}
                <div
                  className={`w-full md:w-[220px] shrink-0 min-h-[140px] md:min-h-full bg-gradient-to-br ${getAvatarGradient(project)} flex items-center justify-center relative p-6 bg-cover bg-center`}
                  style={project.image_url ? { backgroundImage: `url(${project.image_url})` } : {}}
                >
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Right side content block */}
                <div className="flex-1 flex flex-col justify-between p-6 min-w-0">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-bold text-ml-ink tracking-tight transition-colors group-hover:text-ml-blue line-clamp-1">
                        {project.name}
                      </h3>
                      
                      {/* Dropdown Action Menu */}
                      <div className="relative" ref={showMenu ? menuRef : null}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuProjectId(showMenu ? null : project.id);
                          }}
                          className="p-1 rounded-lg hover:bg-ml-surface transition-colors cursor-pointer text-ml-ink-muted/80 hover:text-ml-ink"
                          title="Tùy chọn"
                        >
                          <MoreVertical size={18} />
                        </button>
                        {showMenu && (
                          <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-ml-border bg-white p-1 shadow-md animate-in fade-in zoom-in duration-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditProject(project.id);
                                setActiveMenuProjectId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs font-bold text-ml-ink hover:bg-ml-surface transition-colors cursor-pointer"
                            >
                              <Edit size={13} />
                              Chỉnh sửa
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteProject(project.id);
                                setActiveMenuProjectId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs font-bold text-ml-danger hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 size={13} />
                              Xóa dự án
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="line-clamp-2 text-sm font-medium leading-relaxed text-ml-ink-muted/90">
                      {project.product_description}
                    </p>

                    {/* Tag Badges */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${getIndustryBadgeStyle(project.industry)}`}>
                        {project.industry}
                      </span>
                      <span className="rounded-md bg-violet-50 text-violet-700 border border-violet-100 px-2.5 py-0.5 text-xs font-bold">
                        {project.market}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 text-xs font-bold">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                        {project.status || 'Đang hoạt động'}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom Meta bar */}
                  <div className="flex items-center justify-between border-t border-ml-border/60 pt-4 mt-4">
                    <div className="flex items-center gap-4 text-xs font-semibold text-ml-ink-muted/80">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} className="text-ml-ink-muted/50" />
                        {getRelativeTime(project.updated_at)}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-ml-border" />
                      <span className="flex items-center gap-1.5">
                        <Users size={14} className="text-ml-ink-muted/50" />
                        {project.member_count ?? 3} thành viên
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-lg border border-ml-blue bg-white px-3.5 py-1.5 text-xs font-bold text-ml-blue hover:bg-ml-blue hover:text-white transition-all">
                      Mở dự án
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Grid View rendering */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {paginatedProjects.map((project) => {
            const isActive = activeProjectId === project.id;
            const showMenu = activeMenuProjectId === project.id;

            return (
              <article
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className={`group flex flex-col overflow-hidden rounded-xl border bg-white shadow-xs transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'border-ml-blue ring-1 ring-ml-blue/20 shadow-md'
                    : 'border-ml-border hover:border-ml-blue/40 hover:shadow-sm'
                }`}
              >
                {/* Top gradient block */}
                <div
                  className={`w-full min-h-[140px] bg-gradient-to-br ${getAvatarGradient(project)} flex items-center justify-center relative p-6 bg-cover bg-center`}
                  style={project.image_url ? { backgroundImage: `url(${project.image_url})` } : {}}
                >
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Bottom details block */}
                <div className="flex-1 flex flex-col justify-between p-5 min-w-0">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-base font-bold text-ml-ink tracking-tight transition-colors group-hover:text-ml-blue line-clamp-1">
                        {project.name}
                      </h3>
                      
                      {/* Dropdown Menu */}
                      <div className="relative" ref={showMenu ? menuRef : null}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuProjectId(showMenu ? null : project.id);
                          }}
                          className="p-1 rounded-lg hover:bg-ml-surface transition-colors cursor-pointer text-ml-ink-muted/80 hover:text-ml-ink"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {showMenu && (
                          <div className="absolute right-0 top-full z-20 mt-1 w-32 rounded-lg border border-ml-border bg-white p-1 shadow-md animate-in fade-in zoom-in duration-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditProject(project.id);
                                setActiveMenuProjectId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs font-bold text-ml-ink hover:bg-ml-surface transition-colors cursor-pointer"
                            >
                              <Edit size={13} />
                              Chỉnh sửa
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteProject(project.id);
                                setActiveMenuProjectId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs font-bold text-ml-danger hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 size={13} />
                              Xóa
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="line-clamp-2 text-xs font-medium leading-relaxed text-ml-ink-muted/90">
                      {project.product_description}
                    </p>

                    {/* Tag Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${getIndustryBadgeStyle(project.industry)}`}>
                        {project.industry}
                      </span>
                      <span className="rounded bg-violet-50 text-violet-700 border border-violet-100 px-2 py-0.5 text-[10px] font-bold">
                        {project.market}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 text-[10px] font-bold">
                        <span className="h-1 w-1 rounded-full bg-emerald-600" />
                        {project.status || 'Đang hoạt động'}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom Meta bar */}
                  <div className="border-t border-ml-border/60 pt-3 mt-4 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-ml-ink-muted/80">
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} className="text-ml-ink-muted/50" />
                        {getRelativeTime(project.updated_at)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users size={12} className="text-ml-ink-muted/50" />
                        {project.member_count ?? 3} thành viên
                      </span>
                    </div>

                    <span className="w-full inline-flex items-center justify-center gap-1 rounded-lg border border-ml-blue bg-white py-1.5 text-xs font-bold text-ml-blue hover:bg-ml-blue hover:text-white transition-all">
                      Mở dự án
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between border-t border-ml-border pt-4 text-sm font-semibold text-ml-ink-muted">
          <div>
            Hiển thị {startIndex + 1}–{endIndex} trong {totalItems} dự án
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-ml-border bg-white text-ml-ink hover:bg-ml-surface hover:text-ml-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`h-8 w-8 rounded-lg flex items-center justify-center border font-bold text-xs transition-all cursor-pointer ${
                  currentPage === pageNumber
                    ? 'bg-ml-blue border-ml-blue text-white shadow-xs'
                    : 'border-ml-border bg-white text-ml-ink hover:bg-ml-surface hover:text-ml-ink'
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((c) => Math.min(c + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-ml-border bg-white text-ml-ink hover:bg-ml-surface hover:text-ml-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
