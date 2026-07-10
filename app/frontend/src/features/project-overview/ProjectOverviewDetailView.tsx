import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Bot,
  CalendarDays,
  ChartColumnBig,
  CheckCircle2,
  CircleDot,
  Clock3,
  FileText,
  Layers3,
  MapPin,
  PenSquare,
  Radio,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import {
  formatDate,
  formatRelativeTime,
  studyStatusLabel,
} from './projectOverview.utils';
import type { ProjectOverviewDetailViewProps } from './projectOverview.types';

const studyStatusClasses = {
  completed: 'border-emerald-200 bg-emerald-50 text-ml-success',
  running: 'border-amber-200 bg-amber-50 text-ml-warning',
  draft: 'border-ml-border bg-ml-surface text-ml-ink-muted',
};

const toneClasses = {
  success: 'border-emerald-200 bg-emerald-50/70',
  info: 'border-ml-blue/20 bg-ml-blue-soft/55',
  warning: 'border-amber-200 bg-amber-50/70',
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

export const ProjectOverviewDetailView = ({
  project,
  personas,
  respondents,
  studies,
  metrics,
  onNavigateToPersonas,
  onEditProject,
  onSelectProject,
}: ProjectOverviewDetailViewProps) => (
  <div className="mx-auto flex-1 w-full max-w-[1420px] space-y-3 px-3 py-2 text-ml-ink md:px-4 md:py-3 xl:px-5">
    <section className="overflow-hidden rounded-lg border border-ml-border bg-white">
      <div className="grid gap-0 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.95fr)]">
        <div className="border-b border-ml-border bg-[linear-gradient(135deg,rgba(57,130,203,0.12),rgba(255,255,255,0.98)_42%,rgba(255,255,255,1))] p-3 md:p-4 xl:border-b-0 xl:border-r">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full border border-ml-blue/20 bg-ml-blue-soft px-2 py-0.5 text-[9px] font-bold text-ml-blue">
                <ChartColumnBig size={11} />
                Workspace overview
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-ml-border bg-white px-2 py-0.5 text-[9px] font-semibold text-ml-ink-muted">
                <CalendarDays size={11} />
                Tạo ngày {formatDate(project.created_at)}
              </span>
              {project.is_seeded && (
                <span className="rounded-full border border-ml-border bg-white px-2 py-0.5 text-[9px] font-semibold text-ml-ink-muted">
                  Dữ liệu mô phỏng
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-start">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-ml-border bg-ml-surface md:h-18 md:w-18">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-black text-ml-blue">
                    {project.avatar_text ?? getInitials(project.name)}
                  </div>
                )}
              </div>

              <div className="min-w-0 space-y-2">
                <div className="space-y-2">
                  <h1 className="max-w-5xl text-[18px] font-extrabold leading-snug md:text-[22px]">
                    {project.name}
                  </h1>
                  <p className="max-w-4xl text-[11px] font-medium leading-5 text-ml-ink-muted md:text-[12px]">
                    {project.product_description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    project.industry,
                    project.market,
                    project.status ?? 'Đang hoạt động',
                    `${project.member_count ?? 1} thành viên`,
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-ml-border bg-white px-2 py-1 text-[10px] font-semibold text-ml-ink"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-md border border-ml-border bg-white/90 p-2.5">
                <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-ml-ink-muted">
                  Thị trường
                </div>
                <div className="mt-1 text-[11px] font-semibold leading-4 text-ml-ink">
                  {project.market}
                </div>
              </article>
              <article className="rounded-md border border-ml-border bg-white/90 p-2.5">
                <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-ml-ink-muted">
                  Phương pháp
                </div>
                <div className="mt-1 text-[11px] font-semibold leading-4 text-ml-ink">
                  {project.study_type}
                </div>
              </article>
              <article className="rounded-md border border-ml-border bg-white/90 p-2.5">
                <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-ml-ink-muted">
                  Cập nhật gần nhất
                </div>
                <div className="mt-1 text-[11px] font-semibold leading-4 text-ml-ink">
                  {formatRelativeTime(project.updated_at ?? project.created_at)}
                </div>
              </article>
              <article className="rounded-md border border-ml-border bg-white/90 p-2.5">
                <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-ml-ink-muted">
                  Trạng thái
                </div>
                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-ml-success">
                  <BadgeCheck size={11} />
                  {project.status ?? 'Đang hoạt động'}
                </div>
              </article>
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-3 bg-[#fbfdff] p-3 md:p-4">
          <div className="space-y-3 rounded-md border border-ml-border bg-white p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-ml-blue">
                  Project readiness
                </div>
                <div className="mt-1 text-2xl font-extrabold text-ml-ink">
                  {metrics.readinessPercent}%
                </div>
              </div>
              <div className="rounded-full bg-ml-blue-soft p-2 text-ml-blue">
                <Activity size={14} />
              </div>
            </div>

            <p className="text-[11px] font-medium leading-4 text-ml-ink-muted">
              {metrics.statusTone}
            </p>

            <div className="h-1.5 overflow-hidden rounded-full bg-ml-blue-soft/70">
              <div
                className="h-full rounded-full bg-ml-blue transition-all"
                style={{ width: `${metrics.readinessPercent}%` }}
              />
            </div>

            <div className="space-y-1.5">
              {metrics.readinessSteps.map((step) => (
                <div
                  key={step.label}
                  className="flex items-center justify-between rounded-md border border-ml-border bg-white px-2 py-1.5"
                >
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2
                      size={12}
                      className={step.complete ? 'text-ml-success' : 'text-ml-ink-muted/40'}
                    />
                    <span className="text-[11px] font-semibold text-ml-ink">
                      {step.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-ml-blue">{step.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 rounded-md border border-ml-border bg-white p-3">
            <button
              onClick={onNavigateToPersonas}
              className="group flex w-full items-center justify-center gap-1.5 rounded-md bg-ml-blue px-3 py-2 text-[11px] font-bold text-white transition-colors hover:bg-ml-blue-strong cursor-pointer"
            >
              Mở danh mục persona
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </button>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                onClick={() => onEditProject(project.id)}
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-ml-border bg-white px-3 py-2 text-[11px] font-semibold text-ml-ink transition-colors hover:border-ml-blue/30 hover:bg-ml-blue-soft/25 cursor-pointer"
              >
                <PenSquare size={12} />
                Sửa dự án
              </button>
              <button
                onClick={() => onSelectProject(null)}
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-ml-border bg-white px-3 py-2 text-[11px] font-semibold text-ml-blue transition-colors hover:border-ml-blue/30 hover:bg-ml-blue-soft/25 cursor-pointer"
              >
                <Layers3 size={12} />
                Đổi workspace
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      <article className="rounded-md border border-ml-border bg-white p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-ml-ink-muted">
            Persona
          </span>
          <Users className="text-ml-blue" size={13} />
        </div>
        <div className="mt-2 text-[22px] font-extrabold leading-none text-ml-ink">
          {personas.length}
        </div>
        <p className="mt-2 text-[11px] font-medium leading-4 text-ml-ink-muted">
          Độ tin cậy trung bình {metrics.avgConfidence}% trên các phân khúc hiện tại.
        </p>
      </article>

      <article className="rounded-md border border-ml-border bg-white p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-ml-ink-muted">
            Respondents
          </span>
          <Bot className="text-ml-blue" size={13} />
        </div>
        <div className="mt-2 text-[22px] font-extrabold leading-none text-ml-ink">
          {respondents.length}
        </div>
        <p className="mt-2 text-[11px] font-medium leading-4 text-ml-ink-muted">
          Quy mô panel mô phỏng đang hỗ trợ cho các study đang có.
        </p>
      </article>

      <article className="rounded-md border border-ml-border bg-white p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-ml-ink-muted">
            Study
          </span>
          <FileText className="text-ml-blue" size={13} />
        </div>
        <div className="mt-2 text-[22px] font-extrabold leading-none text-ml-ink">
          {studies.length}
        </div>
        <p className="mt-2 text-[11px] font-medium leading-4 text-ml-ink-muted">
          {metrics.completedStudies.length} hoàn tất, {metrics.runningStudies.length} đang
          chạy, {metrics.draftStudies.length} bản nháp.
        </p>
      </article>

      <article className="rounded-md border border-ml-border bg-white p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-ml-ink-muted">
            Câu hỏi
          </span>
          <BookOpen className="text-ml-blue" size={13} />
        </div>
        <div className="mt-2 text-[22px] font-extrabold leading-none text-ml-ink">
          {metrics.totalQuestions}
        </div>
        <p className="mt-2 text-[11px] font-medium leading-4 text-ml-ink-muted">
          Tổng số câu hỏi đang được cấu hình trong toàn bộ workspace.
        </p>
      </article>
    </section>

    <section className="grid gap-3 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.95fr)]">
      <div className="space-y-3">
        <article className="rounded-md border border-ml-border bg-white p-3 md:p-4">
          <div className="flex flex-col gap-2 border-b border-ml-border pb-2.5 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-ml-blue">
                <Target size={14} />
                <h2 className="text-[13px] font-bold text-ml-ink">Bối cảnh nghiên cứu</h2>
              </div>
              <p className="text-[11px] font-medium leading-4 text-ml-ink-muted">
                Phần này giữ toàn bộ context cốt lõi của dự án để các module sau bám vào
                cùng một giả thuyết nghiên cứu.
              </p>
            </div>
          </div>

          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <div className="rounded-md border border-ml-border bg-[#fcfcfd] p-2.5">
              <div className="flex items-start gap-2">
                <div className="rounded-md bg-ml-blue-soft p-1.5 text-ml-blue">
                  <Target size={12} />
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-ml-ink-muted">
                    Mục tiêu nghiên cứu
                  </div>
                  <p className="mt-1 text-[11px] font-semibold leading-4 text-ml-ink">
                    {project.research_objective}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-ml-border bg-[#fcfcfd] p-2.5">
              <div className="flex items-start gap-2">
                <div className="rounded-md bg-ml-blue-soft p-1.5 text-ml-blue">
                  <Users size={12} />
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-ml-ink-muted">
                    Đối tượng mục tiêu
                  </div>
                  <p className="mt-1 text-[11px] font-semibold leading-4 text-ml-ink">
                    {project.target_audience}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-ml-border bg-[#fcfcfd] p-2.5">
              <div className="flex items-start gap-2">
                <div className="rounded-md bg-ml-blue-soft p-1.5 text-ml-blue">
                  <MapPin size={12} />
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-ml-ink-muted">
                    Bối cảnh thị trường
                  </div>
                  <p className="mt-1 text-[11px] font-semibold leading-4 text-ml-ink">
                    {project.market}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-ml-border bg-[#fcfcfd] p-2.5">
              <div className="flex items-start gap-2">
                <div className="rounded-md bg-ml-blue-soft p-1.5 text-ml-blue">
                  <BookOpen size={12} />
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-ml-ink-muted">
                    Loại study ưu tiên
                  </div>
                  <p className="mt-1 text-[11px] font-semibold leading-4 text-ml-ink">
                    {project.study_type}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-md border border-ml-border bg-white p-3 md:p-4">
          <div className="flex flex-col gap-2 border-b border-ml-border pb-2.5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-ml-blue">
                <FileText size={14} />
                <h2 className="text-[13px] font-bold text-ml-ink">Danh sách study trong dự án</h2>
              </div>
              <p className="mt-1 text-[11px] font-medium leading-4 text-ml-ink-muted">
                Theo dõi study đang nháp, đang chạy và đã hoàn tất ngay trong overview.
              </p>
            </div>
            <div className="rounded-full border border-ml-border bg-[#fcfcfd] px-2 py-1 text-[10px] font-semibold text-ml-ink-muted">
              {studies.length} study
            </div>
          </div>

          {metrics.studyTimeline.length === 0 ? (
            <div className="mt-3 rounded-md border border-dashed border-ml-border bg-ml-surface/60 p-3 text-[11px] font-medium leading-4 text-ml-ink-muted">
              Chưa có study nào trong project này. Hãy thêm study đầu tiên để overview có
              tiến trình nghiên cứu cụ thể hơn.
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {metrics.studyTimeline.map((study) => (
                <article
                  key={study.id}
                  className="grid gap-2 rounded-md border border-ml-border p-2.5 md:grid-cols-[minmax(0,1.4fr)_90px_72px]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="truncate text-[12px] font-bold text-ml-ink">
                        {study.title}
                      </h3>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${
                          studyStatusClasses[study.status]
                        }`}
                      >
                        {studyStatusLabel(study.status)}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] font-medium leading-4 text-ml-ink-muted">
                      Khởi tạo {formatDate(study.createdAt)} · {formatRelativeTime(study.createdAt)}
                    </p>
                  </div>

                  <div className="rounded-md bg-[#fcfcfd] px-2 py-2">
                    <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-ml-ink-muted">
                      Câu hỏi
                    </div>
                    <div className="mt-1 text-[13px] font-bold text-ml-ink">
                      {study.questionCount}
                    </div>
                  </div>

                  <div className="rounded-md bg-[#fcfcfd] px-2 py-2">
                    <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-ml-ink-muted">
                      Panel
                    </div>
                    <div className="mt-1 text-[13px] font-bold text-ml-ink">
                      {respondents.length}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>

        <article className="rounded-md border border-ml-border bg-white p-3 md:p-4">
          <div className="flex flex-col gap-2 border-b border-ml-border pb-2.5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-ml-blue">
                <Users size={14} />
                <h2 className="text-[13px] font-bold text-ml-ink">Phạm vi persona và panel</h2>
              </div>
              <p className="mt-1 text-[11px] font-medium leading-4 text-ml-ink-muted">
                Mỗi persona hiển thị quy mô respondent hiện tại, kênh nổi bật và nhu cầu chính.
              </p>
            </div>
            <div className="rounded-full border border-ml-border bg-[#fcfcfd] px-2 py-1 text-[10px] font-semibold text-ml-ink-muted">
              {respondents.length} respondent
            </div>
          </div>

          {metrics.respondentsPerPersona.length === 0 ? (
            <div className="mt-3 rounded-md border border-dashed border-ml-border bg-ml-surface/60 p-3 text-[11px] font-medium leading-4 text-ml-ink-muted">
              Chưa có persona nào trong project này.
            </div>
          ) : (
            <div className="mt-3 grid gap-2 lg:grid-cols-3">
              {metrics.respondentsPerPersona.map((persona) => {
                const share = respondents.length
                  ? Math.max(8, Math.round((persona.count / respondents.length) * 100))
                  : 0;

                return (
                  <article
                    key={persona.id}
                    className="rounded-md border border-ml-border bg-[#fcfcfd] p-2.5"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ml-blue-soft text-[10px] font-bold text-ml-blue">
                        {getInitials(persona.name)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[12px] font-bold text-ml-ink">{persona.name}</h3>
                        <p className="mt-0.5 text-[10px] font-medium leading-4 text-ml-ink-muted">
                          {persona.segment}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2.5 space-y-2">
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-semibold text-ml-ink">
                          <span>Respondent coverage</span>
                          <span>{persona.count}</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ml-blue-soft/70">
                          <div
                            className="h-full rounded-full bg-ml-blue"
                            style={{ width: `${share}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        <div className="rounded-md border border-ml-border bg-white px-2 py-1.5">
                          <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-ml-ink-muted">
                            Confidence
                          </div>
                          <div className="mt-0.5 text-[11px] font-bold text-ml-ink">
                            {persona.confidenceScore}%
                          </div>
                        </div>
                        <div className="rounded-md border border-ml-border bg-white px-2 py-1.5">
                          <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-ml-ink-muted">
                            Kênh đầu
                          </div>
                          <div className="mt-0.5 text-[11px] font-bold text-ml-ink">
                            {persona.topChannel}
                          </div>
                        </div>
                      </div>

                      <p className="text-[10px] font-medium leading-4 text-ml-ink-muted">
                        {persona.primaryNeed}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </article>
      </div>

      <div className="space-y-3">
        <article className="rounded-md border border-ml-border bg-white p-3">
          <div className="flex items-center gap-1.5 border-b border-ml-border pb-2.5">
            <Sparkles className="text-ml-blue" size={14} />
            <h2 className="text-[13px] font-bold text-ml-ink">Tín hiệu nổi bật</h2>
          </div>

          <div className="mt-3 space-y-2">
            {metrics.highlights.map((highlight) => (
              <article
                key={highlight.title}
                className={`rounded-md border p-2.5 ${toneClasses[highlight.tone]}`}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 rounded-full bg-white/80 p-1.5 text-ml-blue">
                    <CircleDot size={11} />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold leading-4 text-ml-ink">
                      {highlight.title}
                    </h3>
                    <p className="mt-1 text-[10px] font-medium leading-4 text-ml-ink-muted">
                      {highlight.detail}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-3 rounded-md border border-ml-border bg-[#fcfcfd] p-2.5">
            <div className="flex items-center gap-1.5">
              <Radio size={12} className="text-ml-blue" />
              <div className="text-[11px] font-bold text-ml-ink">Channel mix hiện tại</div>
            </div>
            <div className="mt-2.5 space-y-2">
              {metrics.channelMix.length > 0 ? (
                metrics.channelMix.map((channel) => (
                  <div key={channel.label}>
                    <div className="flex items-center justify-between text-[10px] font-semibold text-ml-ink">
                      <span>{channel.label}</span>
                      <span>{channel.share}%</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ml-blue-soft/70">
                      <div
                        className="h-full rounded-full bg-ml-blue"
                        style={{ width: `${channel.share}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] font-medium leading-4 text-ml-ink-muted">
                  Chưa có dữ liệu kênh từ panel hiện tại.
                </p>
              )}
            </div>
          </div>
        </article>

        <article className="rounded-md border border-ml-border bg-white p-3">
          <div className="flex items-center gap-1.5 border-b border-ml-border pb-2.5">
            <Clock3 className="text-ml-blue" size={14} />
            <h2 className="text-[13px] font-bold text-ml-ink">Hoạt động gần đây</h2>
          </div>

          <div className="mt-3 space-y-2.5">
            {metrics.recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-2">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ml-blue-soft text-ml-blue">
                  <Activity size={11} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="text-[11px] font-bold text-ml-ink">{activity.title}</h3>
                    {activity.timestamp && (
                      <span className="text-[9px] font-semibold text-ml-ink-muted">
                        {formatRelativeTime(activity.timestamp)}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[10px] font-medium leading-4 text-ml-ink-muted">
                    {activity.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-md border border-ml-border bg-white p-3">
          <div className="flex items-center gap-1.5 border-b border-ml-border pb-2.5">
            <ArrowRight className="text-ml-blue" size={14} />
            <h2 className="text-[13px] font-bold text-ml-ink">Bước tiếp theo</h2>
          </div>

          <div className="mt-3 space-y-2">
            {metrics.nextActions.map((action) => (
              <div
                key={action}
                className="flex gap-2 rounded-md border border-ml-border bg-[#fcfcfd] p-2.5"
              >
                <div className="mt-0.5 rounded-full bg-white p-1.5 text-ml-blue">
                  <ArrowRight size={11} />
                </div>
                <p className="text-[10px] font-medium leading-4 text-ml-ink">
                  {action}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-md border border-amber-200 bg-amber-50/60 p-3">
          <div className="flex items-start gap-2">
            <div className="rounded-full bg-white/90 p-1.5 text-ml-warning">
              <CheckCircle2 size={12} />
            </div>
            <div>
              <h2 className="text-[12px] font-bold text-ml-ink">
                Synthetic research note
              </h2>
              <p className="mt-1 text-[10px] font-medium leading-4 text-ml-ink-muted">
                Các persona, respondent và tín hiệu hiển thị trên overview là dữ liệu mô
                phỏng để kiểm tra giả thuyết nhanh. Chúng hữu ích cho việc sắp xếp ưu tiên
                concept nhưng vẫn cần xác thực lại bằng nghiên cứu với người thật.
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
);
