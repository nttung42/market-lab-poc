import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Layers3,
  MapPin,
  Target,
  Users,
} from 'lucide-react';
import { formatDate, studyStatusLabel } from './projectOverview.utils';
import type { ProjectOverviewDetailViewProps } from './projectOverview.types';

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
  <div className="mx-auto flex-1 w-full max-w-6xl space-y-6 px-5 py-6 text-ml-ink md:px-6 md:py-8">
    <section className="overflow-hidden rounded-xl border border-ml-border bg-white">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.7fr)_360px]">
        <div className="relative overflow-hidden border-b border-ml-border bg-[linear-gradient(135deg,rgba(57,130,203,0.14),rgba(255,255,255,0.98)_58%)] p-6 md:p-8 lg:border-b-0 lg:border-r">
          <div className="absolute inset-y-0 right-0 hidden w-40 bg-[radial-gradient(circle_at_center,rgba(57,130,203,0.14),transparent_70%)] lg:block" />
          <div className="relative space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-ml-blue/20 bg-ml-blue-soft px-3 py-1 text-[10px] font-black uppercase tracking-wider text-ml-blue">
                <BarChart3 size={12} />
                Dự án đang hoạt động
              </span>
              {project.is_seeded && (
                <span className="rounded-full border border-ml-border bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-ml-ink">
                  Dữ liệu mẫu
                </span>
              )}
              <span className="rounded-full border border-ml-border bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">
                Tạo ngày {formatDate(project.created_at)}
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="max-w-4xl text-[28px] font-black uppercase leading-tight md:text-[38px]">
                {project.name}
              </h1>
              <p className="max-w-3xl text-sm font-medium leading-7 text-ml-ink-muted md:text-[15px]">
                {project.product_description}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ['Ngành', project.industry],
                ['Thị trường', project.market],
                ['Phương pháp', project.study_type],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-ml-border bg-white/90 p-3">
                  <div className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">
                    {label}
                  </div>
                  <div className="mt-1 text-sm font-bold text-ml-ink">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="flex flex-col justify-between gap-5 border-t border-ml-border bg-[linear-gradient(180deg,rgba(219,234,250,0.72),rgba(255,255,255,0.98))] p-6 text-ml-ink lg:border-t-0">
          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-ml-blue">
                Mức độ sẵn sàng
              </div>
              <div className="mt-2 text-3xl font-black text-ml-ink">
                {metrics.readinessPercent}%
              </div>
              <p className="mt-1 text-sm font-semibold leading-6 text-ml-ink-muted">
                {metrics.statusTone}
              </p>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-ml-blue-soft/70">
              <div
                className="h-full rounded-full bg-ml-blue transition-all"
                style={{ width: `${metrics.readinessPercent}%` }}
              />
            </div>

            <div className="space-y-2">
              {metrics.readinessSteps.map((step) => (
                <div
                  key={step.label}
                  className="flex items-center justify-between rounded-lg border border-ml-border bg-white px-3 py-2.5 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={14}
                      className={step.complete ? 'text-ml-blue' : 'text-ml-ink-muted/40'}
                    />
                    <span className="text-xs font-semibold text-ml-ink">{step.label}</span>
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-ml-blue">
                    {step.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={onNavigateToPersonas}
              className="group flex items-center justify-center gap-2 rounded-lg bg-ml-blue px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-ml-blue-strong cursor-pointer"
            >
              Mở danh mục chân dung
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => onEditProject(project.id)}
                className="flex-1 rounded-lg border border-ml-border bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-ml-ink transition-colors hover:border-ml-blue/30 hover:bg-ml-blue-soft/25 cursor-pointer"
              >
                Sửa
              </button>
              <button
                onClick={() => onSelectProject(null)}
                className="flex-1 rounded-lg border border-ml-border bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-ml-blue transition-colors hover:border-ml-blue/30 hover:bg-ml-blue-soft/25 cursor-pointer"
              >
                Đổi dự án
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article className="rounded-lg border border-ml-border bg-white p-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">
            Chân dung
          </span>
          <Users className="text-ml-blue" size={16} />
        </div>
        <div className="mt-3 text-3xl font-black text-ml-ink">{personas.length}</div>
        <p className="mt-2 text-xs font-medium leading-5 text-ml-ink-muted">
          Độ tin cậy trung bình {metrics.avgConfidence}% trên bộ chân dung hiện tại.
        </p>
      </article>

      <article className="rounded-lg border border-ml-border bg-white p-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">
            Người tham gia
          </span>
          <Layers3 className="text-ml-blue" size={16} />
        </div>
        <div className="mt-3 text-3xl font-black text-ml-ink">{respondents.length}</div>
        <p className="mt-2 text-xs font-medium leading-5 text-ml-ink-muted">
          Quy mô nhóm mô phỏng hiện có để chạy nghiên cứu.
        </p>
      </article>

      <article className="rounded-lg border border-ml-border bg-white p-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">
            Nghiên cứu
          </span>
          <ClipboardList className="text-ml-blue" size={16} />
        </div>
        <div className="mt-3 text-3xl font-black text-ml-ink">{studies.length}</div>
        <p className="mt-2 text-xs font-medium leading-5 text-ml-ink-muted">
          {metrics.completedStudies.length} đã hoàn tất, {metrics.draftStudies.length} bản
          nháp, {metrics.totalQuestions} câu hỏi tổng cộng.
        </p>
      </article>

      <article className="rounded-lg border border-ml-border bg-white p-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">
            Hoạt động gần nhất
          </span>
          <CalendarDays className="text-ml-blue" size={16} />
        </div>
        <div className="mt-3 text-lg font-black leading-tight text-ml-ink">
          {metrics.latestStudy ? formatDate(metrics.latestStudy.created_at) : 'Chưa có nghiên cứu'}
        </div>
        <p className="mt-2 text-xs font-medium leading-5 text-ml-ink-muted">
          {metrics.latestStudy
            ? `${metrics.latestStudy.title} là nghiên cứu mới nhất trong dự án này.`
            : 'Hãy tạo nghiên cứu để bắt đầu thu thập kết quả mô phỏng.'}
        </p>
      </article>
    </section>

    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)]">
      <div className="space-y-6">
        <article className="rounded-lg border border-ml-border bg-white p-5 md:p-6">
          <div className="flex items-center gap-2 border-b border-ml-border pb-3">
            <Target className="text-ml-blue" size={18} />
            <h2 className="text-base font-black uppercase tracking-wide text-ml-ink">
              Tóm tắt nghiên cứu
            </h2>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-md bg-ml-surface p-2 text-ml-ink-muted">
                  <Activity size={16} />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">
                    Mục tiêu nghiên cứu
                  </div>
                  <div className="mt-1 text-sm font-semibold leading-6 text-ml-ink">
                    {project.research_objective}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-md bg-ml-surface p-2 text-ml-ink-muted">
                  <Users size={16} />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">
                    Đối tượng mục tiêu
                  </div>
                  <div className="mt-1 text-sm font-semibold leading-6 text-ml-ink">
                    {project.target_audience}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-md bg-ml-surface p-2 text-ml-ink-muted">
                  <MapPin size={16} />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">
                    Bối cảnh thị trường
                  </div>
                  <div className="mt-1 text-sm font-semibold leading-6 text-ml-ink">
                    {project.market}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-md bg-ml-surface p-2 text-ml-ink-muted">
                  <BookOpen size={16} />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">
                    Phương pháp nghiên cứu
                  </div>
                  <div className="mt-1 text-sm font-semibold leading-6 text-ml-ink">
                    {project.study_type}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-ml-border bg-white p-5 md:p-6">
          <div className="flex items-center justify-between gap-3 border-b border-ml-border pb-3">
            <div className="flex items-center gap-2">
              <Users className="text-ml-blue" size={18} />
              <h2 className="text-base font-black uppercase tracking-wide text-ml-ink">
                Phạm vi chân dung
              </h2>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">
              {personas.length} phân khúc
            </span>
          </div>

          {metrics.personaHighlights.length === 0 ? (
            <div className="mt-5 rounded-lg border border-dashed border-ml-border bg-ml-surface/60 p-5 text-sm font-medium text-ml-ink-muted">
              Chưa có bộ chân dung nào. Hãy thêm phân khúc đối tượng để mở khóa các mô phỏng có ý nghĩa hơn.
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {metrics.personaHighlights.map((persona) => (
                <article key={persona.id} className="rounded-lg border border-ml-border bg-ml-surface/45 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-black text-ml-ink">{persona.name}</div>
                      <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-ml-ink-muted">
                        {persona.segment}
                      </div>
                    </div>
                    <span className="rounded-full border border-ml-blue/20 bg-white px-2 py-1 text-[10px] font-black uppercase tracking-wider text-ml-blue">
                      {persona.confidence_score}%
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-4 text-xs font-medium leading-5 text-ml-ink-muted">
                    {persona.quote}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {persona.channels.slice(0, 2).map((channel) => (
                      <span
                        key={channel}
                        className="rounded border border-ml-border bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-ml-ink-muted"
                      >
                        {channel}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>
      </div>

      <div className="space-y-6">
        <article className="rounded-lg border border-ml-border bg-white p-5">
          <div className="flex items-center gap-2 border-b border-ml-border pb-3">
            <Clock3 className="text-ml-blue" size={18} />
            <h2 className="text-base font-black uppercase tracking-wide text-ml-ink">
              Hoạt động nghiên cứu
            </h2>
          </div>

          {metrics.latestStudy ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-lg border border-ml-border bg-ml-surface/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-black text-ml-ink">
                    {metrics.latestStudy.title}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                      metrics.latestStudy.status === 'completed'
                        ? 'bg-ml-blue-soft text-ml-blue'
                        : 'bg-ml-surface text-ml-ink-muted'
                    }`}
                  >
                    {studyStatusLabel(metrics.latestStudy.status)}
                  </span>
                </div>
                <div className="mt-3 text-xs font-medium leading-5 text-ml-ink-muted">
                  Tạo ngày {formatDate(metrics.latestStudy.created_at)} với{' '}
                  {metrics.latestStudy.questions?.length ?? 0} câu hỏi đã cấu hình.
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-ml-border p-3">
                  <div className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">
                    Nghiên cứu hoàn tất
                  </div>
                  <div className="mt-2 text-2xl font-black text-ml-ink">
                    {metrics.completedStudies.length}
                  </div>
                </div>
                <div className="rounded-lg border border-ml-border p-3">
                  <div className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">
                    Ngân hàng câu hỏi
                  </div>
                  <div className="mt-2 text-2xl font-black text-ml-ink">
                    {metrics.totalQuestions}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-lg border border-dashed border-ml-border bg-ml-surface/60 p-5 text-sm font-medium leading-6 text-ml-ink-muted">
              Dự án này chưa có nghiên cứu nào. Hãy tạo một nghiên cứu sau khi hoàn tất thiết lập chân dung và người tham gia.
            </div>
          )}
        </article>

        <article className="rounded-lg border border-ml-border bg-white p-5">
          <div className="flex items-center gap-2 border-b border-ml-border pb-3">
            <CheckCircle2 className="text-ml-blue" size={18} />
            <h2 className="text-base font-black uppercase tracking-wide text-ml-ink">
              Tóm tắt tín hiệu
            </h2>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-ml-ink-muted">
                Kênh nổi bật
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {metrics.topChannels.length > 0 ? (
                  metrics.topChannels.map((channel) => (
                    <span
                      key={channel}
                      className="rounded-full border border-ml-border bg-ml-surface px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-ml-ink"
                    >
                      {channel}
                    </span>
                  ))
                ) : (
                  <span className="text-sm font-medium text-ml-ink-muted">
                    Chưa có tín hiệu kênh nào.
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-ml-blue/20 bg-ml-blue-soft/55 p-4">
              <div className="text-[10px] font-black uppercase tracking-wider text-ml-blue">
                Ghi chú mô phỏng
              </div>
              <p className="mt-2 text-xs font-medium leading-5 text-ml-ink">
                Các chỉ số và insight trong dự án là tín hiệu mô phỏng mang tính định hướng, hữu ích cho việc khám phá concept nhanh trước khi xác thực bằng người thật.
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
);
