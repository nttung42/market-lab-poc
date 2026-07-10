import type { Persona, Study } from '../../types';
import type {
  ProjectFormValues,
  ProjectOverviewDetailMetrics,
} from './projectOverview.types';

export const defaultProjectFormValues: ProjectFormValues = {
  name: '',
  product_description: '',
  industry: '',
  market: '',
  target_audience: '',
  research_objective: '',
  study_type: 'Kiểm thử concept / thông điệp mô phỏng',
};

export const projectStudyTypeOptions = [
  'Kiểm thử concept / thông điệp mô phỏng',
  'Kiểm thử độ nhạy về giá',
  'Khảo sát ưu tiên tính năng',
];

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

export const formatDate = (value?: string) => {
  if (!value) {
    return 'Không có';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Không có';
  }

  return parsed.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const buildProjectOverviewMetrics = (
  personas: Persona[],
  respondentsCount: number,
  studies: Study[],
): ProjectOverviewDetailMetrics => {
  const completedStudies = studies.filter((study) => study.status === 'completed');
  const draftStudies = studies.filter((study) => study.status === 'draft');
  const totalQuestions = studies.reduce(
    (sum, study) => sum + (study.questions?.length ?? 0),
    0,
  );
  const avgConfidence = personas.length
    ? Math.round(
        personas.reduce((sum, persona) => sum + persona.confidence_score, 0) /
          personas.length,
      )
    : 0;

  const readinessSteps = [
    { label: 'Đã có chân dung', complete: personas.length > 0, value: `${personas.length}` },
    {
      label: 'Đã có nhóm mô phỏng',
      complete: respondentsCount > 0,
      value: `${respondentsCount}`,
    },
    { label: 'Đã tạo nghiên cứu', complete: studies.length > 0, value: `${studies.length}` },
    {
      label: 'Đã có kết quả',
      complete: completedStudies.length > 0,
      value: `${completedStudies.length}`,
    },
  ];
  const readinessCompleted = readinessSteps.filter((step) => step.complete).length;
  const readinessPercent = Math.round(
    (readinessCompleted / readinessSteps.length) * 100,
  );
  const latestStudy =
    [...studies].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )[0] ?? null;
  const topChannels = Array.from(
    new Set(personas.flatMap((persona) => persona.channels).filter(Boolean)),
  ).slice(0, 4);
  const personaHighlights = personas.slice(0, 3);
  const statusTone =
    readinessPercent >= 100
      ? 'Sẵn sàng xem kết quả mô phỏng'
      : readinessPercent >= 50
        ? 'Đang hoàn thiện thiết lập cốt lõi'
        : 'Cần thiết lập thêm trước khi dùng các mô-đun tiếp theo';

  return {
    completedStudies,
    draftStudies,
    totalQuestions,
    avgConfidence,
    readinessSteps,
    readinessPercent,
    latestStudy,
    topChannels,
    personaHighlights,
    statusTone,
  };
};

export const studyStatusLabel = (status: Study['status']) =>
  status === 'completed' ? 'hoàn tất' : status === 'running' ? 'đang chạy' : 'bản nháp';
