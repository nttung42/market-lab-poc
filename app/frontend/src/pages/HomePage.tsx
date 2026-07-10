import {
  ArrowRight,
  Beaker,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  FolderKanban,
  Lightbulb,
  type LucideIcon,
  MoreVertical,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useMemo } from 'react';
import { useWorkspaceContext } from '../components/WorkspaceShell';

type MetricTone = 'blue' | 'violet' | 'emerald' | 'orange';

type MockMetric = {
  label: string;
  value: number;
  change: string;
  detail?: string;
  icon: LucideIcon;
  tone: MetricTone;
};

type ContinueCard = {
  id: string;
  badge: string;
  badgeTone: string;
  avatar: string;
  title: string;
  progress: number;
  meta: string;
  gradient: string;
};

type ActivityItem = {
  id: string;
  title: string;
  project: string;
  time: string;
  icon: LucideIcon;
  tone: string;
};

type InsightItem = {
  id: string;
  title: string;
  meta: string;
  confidence: string;
  icon: LucideIcon;
  tone: string;
};

type StudyRow = {
  id: string;
  type: string;
  title: string;
  result: string;
  status: string;
  updated: string;
  tone: string;
};

const metricToneMap: Record<MetricTone, { icon: string; accent: string }> = {
  blue: {
    icon: 'bg-ml-blue-soft text-ml-blue',
    accent: 'text-ml-blue',
  },
  violet: {
    icon: 'bg-ml-surface text-ml-ink',
    accent: 'text-ml-blue',
  },
  emerald: {
    icon: 'bg-ml-surface text-ml-success',
    accent: 'text-emerald-600',
  },
  orange: {
    icon: 'bg-ml-surface text-ml-warning',
    accent: 'text-ml-warning',
  },
};

const continueCards: ContinueCard[] = [
  {
    id: 'english-learning-app-poc',
    badge: 'Đang làm',
    badgeTone: 'bg-ml-blue text-white',
    avatar: 'EN',
    title: 'Ứng dụng luyện nói tiếng Anh cho sinh viên Việt Nam',
    progress: 72,
    meta: '5 Persona • 2 Studies • Cập nhật 2 giờ trước',
    gradient: 'from-ml-blue-soft via-white to-white',
  },
  {
    id: 'healthy-snack-launch',
    badge: 'Dự thảo',
    badgeTone: 'bg-orange-500 text-white',
    avatar: 'SN',
    title: 'Hộp snack lành mạnh cho nhân viên văn phòng',
    progress: 38,
    meta: '3 Persona • 1 Study • Cập nhật hôm qua',
    gradient: 'from-[#f9ead7] via-white to-white',
  },
  {
    id: 'busy-life-supplement',
    badge: 'Đang chuẩn bị',
    badgeTone: 'bg-emerald-600 text-white',
    avatar: 'BF',
    title: 'Thực phẩm chức năng cho người bận rộn',
    progress: 16,
    meta: '1 Persona • 0 Study • Cập nhật 3 ngày trước',
    gradient: 'from-[#e6f5ec] via-white to-white',
  },
];

const recentActivities: ActivityItem[] = [
  {
    id: 'activity-1',
    title: 'Concept Test "Bao bì mẫu A vs B" đã hoàn thành',
    project: 'Dự án: Hộp snack lành mạnh',
    time: '2 giờ trước',
    icon: CheckCircle2,
    tone: 'bg-ml-surface text-ml-success',
  },
  {
    id: 'activity-2',
    title: 'Đã tạo mới 3 persona',
    project: 'Dự án: Ứng dụng luyện nói tiếng Anh',
    time: '5 giờ trước',
    icon: Users,
    tone: 'bg-ml-blue-soft text-ml-blue',
  },
  {
    id: 'activity-3',
    title: 'Báo cáo "Concept Test - Vòng 1" đã xuất',
    project: 'Dự án: Hộp snack lành mạnh',
    time: '1 ngày trước',
    icon: FileText,
    tone: 'bg-ml-blue-soft text-ml-blue',
  },
  {
    id: 'activity-4',
    title: 'Pricing Test đang chạy',
    project: 'Dự án: Hộp snack lành mạnh',
    time: '1 ngày trước',
    icon: Beaker,
    tone: 'bg-ml-surface text-ml-warning',
  },
  {
    id: 'activity-5',
    title: 'Message Test "Thông điệp A vs B" đã hoàn thành',
    project: 'Dự án: Ứng dụng luyện nói tiếng Anh',
    time: '2 ngày trước',
    icon: CheckCircle2,
    tone: 'bg-ml-surface text-ml-success',
  },
];

const insights: InsightItem[] = [
  {
    id: 'insight-1',
    title: 'Sinh viên lo ngại việc AI sửa phát âm thiếu tự nhiên',
    meta: 'Nhóm Sinh viên năm 1-2 • 34/50 respondents',
    confidence: 'Confidence 82%',
    icon: Lightbulb,
    tone: 'bg-ml-blue text-white',
  },
  {
    id: 'insight-2',
    title: 'Giá trên 249K làm purchase intent giảm đáng kể',
    meta: 'Pricing Test • 27/50 respondents',
    confidence: 'Confidence 76%',
    icon: Lightbulb,
    tone: 'bg-ml-success text-white',
  },
  {
    id: 'insight-3',
    title: 'Thông điệp nhấn mạnh "tiết kiệm thời gian" có tính thuyết phục cao hơn',
    meta: 'Message Test • 31/50 respondents',
    confidence: 'Confidence 71%',
    icon: Lightbulb,
    tone: 'bg-ml-ink text-white',
  },
];

const recentStudies: StudyRow[] = [
  {
    id: 'study-1',
    type: 'Concept Testing',
    title: 'Bao bì mẫu A vs B',
    result: 'Purchase Intent 72% (A)',
    status: 'Hoàn thành',
    updated: '2 giờ trước',
    tone: 'bg-emerald-50 text-emerald-700',
  },
  {
    id: 'study-2',
    type: 'Message Testing',
    title: 'Thông điệp A vs B',
    result: 'Message B hiệu quả hơn +18%',
    status: 'Hoàn thành',
    updated: '1 ngày trước',
    tone: 'bg-emerald-50 text-emerald-700',
  },
  {
    id: 'study-3',
    type: 'Pricing Testing',
    title: 'Gói giá 149K vs 199K vs 249K',
    result: 'WTP tối ưu: 199K-249K',
    status: 'Bản nháp',
    updated: '1 ngày trước',
    tone: 'bg-blue-50 text-ml-blue',
  },
  {
    id: 'study-4',
    type: 'Nghiên cứu tổng hợp',
    title: 'Nhu cầu & hành vi sinh viên',
    result: '5 insight chính được xác định',
    status: 'Đang chạy',
    updated: '2 ngày trước',
    tone: 'bg-[#f9ead7] text-ml-warning',
  },
];

const pipelineSteps = [
  {
    title: 'Persona',
    meta: '5 / 5 hoàn tất',
    icon: Users,
    active: false,
    complete: true,
  },
  {
    title: 'Synthetic Panel',
    meta: '50 / 50 hoàn tất',
    icon: Sparkles,
    active: false,
    complete: true,
  },
  {
    title: 'Nghiên cứu (Study)',
    meta: '2 đang chạy',
    icon: Beaker,
    active: true,
    complete: false,
  },
  {
    title: 'Insight',
    meta: 'Chờ kết quả',
    icon: TrendingUp,
    active: false,
    complete: false,
  },
  {
    title: 'Report',
    meta: 'Chờ xuất báo cáo',
    icon: FileText,
    active: false,
    complete: false,
  },
];

export const HomePage = () => {
  const workspace = useWorkspaceContext();

  const metrics = useMemo<MockMetric[]>(
    () => [
      {
        label: 'Dự án đang hoạt động',
        value: Math.max(workspace.projects.length, 3),
        change: `${Math.max(1, workspace.projects.length - 1)} so với tuần trước`,
        icon: FolderKanban,
        tone: 'blue',
      },
      {
        label: 'Persona',
        value: 12,
        change: '3 so với tuần trước',
        icon: Users,
        tone: 'violet',
      },
      {
        label: 'Nghiên cứu (Studies)',
        value: 5,
        change: '2 so với tuần trước',
        icon: Beaker,
        tone: 'emerald',
      },
      {
        label: 'Nghiên cứu đang chạy',
        value: 2,
        change: 'Ước tính hoàn thành 2h',
        detail: 'Đang theo dõi',
        icon: Clock3,
        tone: 'orange',
      },
      {
        label: 'Báo cáo đã xuất',
        value: 4,
        change: '2 so với tuần trước',
        icon: FileText,
        tone: 'blue',
      },
    ],
    [workspace.projects.length],
  );

  const openCard = (cardId: string) => {
    const project = workspace.projects.find((item) => item.id === cardId);

    if (project) {
      workspace.openProjectDetail(project.id);
      return;
    }

    workspace.openProjectDirectory();
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-4 text-ml-ink md:px-6 md:py-5">
      <section className="rounded-xl border border-ml-border bg-[linear-gradient(180deg,#ffffff,#f7fbff)] p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-ml-ink md:text-3xl">
              Tổng quan
            </h1>
            <p className="mt-1 text-sm font-medium text-ml-ink-muted">
              Snapshot nhanh cho các dự án nghiên cứu đang chạy.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const firstProject = workspace.projects[0];
              if (firstProject) {
                workspace.openProjectDetail(firstProject.id);
                return;
              }
              workspace.openCreateProject();
            }}
            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg bg-ml-blue px-4 text-sm font-bold text-white transition-colors hover:bg-ml-blue-strong"
          >
            <Plus size={14} />
            Tạo nghiên cứu mới
            <ChevronDown size={14} />
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {metrics.map((item) => {
            const Icon = item.icon;
            const tone = metricToneMap[item.tone];

            return (
              <article
                key={item.label}
                className="rounded-xl border border-ml-border bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-black uppercase tracking-wider text-ml-ink-muted">
                      {item.label}
                    </p>
                    <div className="mt-2 text-3xl font-black text-ml-ink">{item.value}</div>
                  </div>
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone.icon}`}
                  >
                    <Icon size={18} />
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold">
                  <TrendingUp size={13} className={tone.accent} />
                  <span className={tone.accent}>{item.change}</span>
                </div>
                {item.detail ? (
                  <div className="mt-1 text-xs font-medium text-ml-ink-muted">{item.detail}</div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_340px]">
        <div className="space-y-4">
          <section className="rounded-xl border border-ml-border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-ml-ink md:text-xl">Tiếp tục công việc</h2>
              <button
                type="button"
                onClick={workspace.openProjectDirectory}
                className="inline-flex items-center gap-2 text-sm font-bold text-ml-blue transition-colors hover:text-ml-blue-strong"
              >
                Xem tất cả
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {continueCards.map((card) => (
                <article key={card.id} className="overflow-hidden rounded-xl border border-ml-border bg-white">
                  <div className={`bg-gradient-to-br ${card.gradient} p-3`}>
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${card.badgeTone}`}
                      >
                        {card.badge}
                      </span>
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-ml-ink-muted transition-colors hover:text-ml-ink"
                      >
                        <MoreVertical size={14} />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ml-blue text-sm font-black text-white">
                        {card.avatar}
                      </span>
                      <h3 className="line-clamp-2 text-sm font-bold leading-6 text-ml-ink">
                        {card.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-ml-ink-muted">
                      <span>Tiến độ</span>
                      <span className="text-ml-ink">{card.progress}%</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ml-surface">
                      <div
                        className="h-full rounded-full bg-ml-blue"
                        style={{ width: `${card.progress}%` }}
                      />
                    </div>
                    <p className="mt-3 text-xs font-medium text-ml-ink-muted">{card.meta}</p>
                    <button
                      type="button"
                      onClick={() => openCard(card.id)}
                      className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-ml-border bg-white text-sm font-bold text-ml-blue transition-colors hover:border-ml-blue/30 hover:bg-ml-blue-soft/30"
                    >
                      Tiếp tục
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-ml-border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-ml-ink md:text-xl">Pipeline nghiên cứu</h2>
              <span className="inline-flex h-4.5 w-4.5 items-center justify-center rounded-full border border-ml-border text-[10px] font-bold text-ml-ink-muted">
                i
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-5">
              {pipelineSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.title}
                    className={`rounded-xl border p-3 ${
                      step.active
                        ? 'border-ml-warning/30 bg-[#fff7ed]'
                        : 'border-ml-border bg-ml-surface/55'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                          step.complete
                            ? 'bg-ml-success text-white'
                            : step.active
                              ? 'bg-[#fde8d2] text-ml-warning'
                              : 'bg-white text-ml-ink-muted'
                        }`}
                      >
                        <Icon size={16} />
                      </span>
                      {index < pipelineSteps.length - 1 ? (
                        <span className="hidden h-px flex-1 bg-ml-border md:block" />
                      ) : null}
                    </div>
                    <div className="mt-3 text-sm font-bold text-ml-ink">{step.title}</div>
                    <div
                      className={`mt-1 text-xs font-medium ${
                        step.active ? 'text-ml-warning' : 'text-ml-ink-muted'
                      }`}
                    >
                      {step.meta}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl border border-ml-border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-ml-ink md:text-xl">Nghiên cứu gần đây</h2>
              <button
                type="button"
                onClick={workspace.openProjectDirectory}
                className="inline-flex items-center gap-2 text-sm font-bold text-ml-blue transition-colors hover:text-ml-blue-strong"
              >
                Xem tất cả
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-ml-border">
              <div className="hidden grid-cols-[1.05fr_1.3fr_1.25fr_0.8fr_0.75fr_32px] gap-3 bg-ml-surface px-3 py-2.5 text-[11px] font-black uppercase tracking-wider text-ml-ink-muted md:grid">
                <span>Loại</span>
                <span>Tên nghiên cứu</span>
                <span>Kết quả</span>
                <span>Trạng thái</span>
                <span>Cập nhật</span>
                <span />
              </div>

              <div className="divide-y divide-ml-border bg-white">
                {recentStudies.map((row) => (
                  <div
                    key={row.id}
                    className="grid gap-2 px-3 py-3 md:grid-cols-[1.05fr_1.3fr_1.25fr_0.8fr_0.75fr_32px] md:items-center"
                  >
                    <div className="text-xs font-bold text-ml-ink">{row.type}</div>
                    <div className="text-sm font-semibold text-ml-ink">{row.title}</div>
                    <div className="text-xs font-medium text-ml-ink-muted">{row.result}</div>
                    <div>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${row.tone}`}>
                        {row.status}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-ml-ink-muted">{row.updated}</div>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ml-ink-muted transition-colors hover:bg-ml-surface hover:text-ml-ink"
                    >
                      <MoreVertical size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <section className="rounded-xl border border-ml-border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-ml-ink md:text-xl">Hoạt động gần đây</h2>
              <button
                type="button"
                onClick={workspace.openProjectDirectory}
                className="inline-flex items-center gap-2 text-sm font-bold text-ml-blue transition-colors hover:text-ml-blue-strong"
              >
                Xem tất cả
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="mt-4 divide-y divide-ml-border">
              {recentActivities.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                    <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.tone}`}>
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold leading-6 text-ml-ink">{item.title}</div>
                      <div className="mt-0.5 text-xs font-medium text-ml-ink-muted">{item.project}</div>
                    </div>
                    <div className="shrink-0 text-xs font-medium text-ml-ink-muted">{item.time}</div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl border border-ml-border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-ml-ink md:text-xl">Insight mới</h2>
              <button
                type="button"
                onClick={workspace.openProjectDirectory}
                className="inline-flex items-center gap-2 text-sm font-bold text-ml-blue transition-colors hover:text-ml-blue-strong"
              >
                Xem tất cả
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="mt-4 divide-y divide-ml-border">
              {insights.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                    <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.tone}`}>
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold leading-6 text-ml-ink">{item.title}</div>
                      <div className="mt-0.5 text-xs font-medium text-ml-ink-muted">{item.meta}</div>
                    </div>
                    <span className="shrink-0 rounded-full bg-ml-blue-soft px-2.5 py-1 text-[11px] font-bold text-ml-blue">
                      {item.confidence}
                    </span>
                  </article>
                );
              })}
            </div>

            <button
              type="button"
              onClick={workspace.openProjectDirectory}
              className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-ml-border bg-ml-surface text-sm font-bold text-ml-blue transition-colors hover:border-ml-blue/30 hover:bg-ml-blue-soft/30"
            >
              Xem Insight Dashboard
              <ArrowRight size={14} />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};
