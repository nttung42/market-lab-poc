import type { Persona, Respondent, Study } from '../../types';
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

export const formatRelativeTime = (value?: string) => {
  if (!value) {
    return 'Không có';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Không có';
  }

  const diffMs = Date.now() - parsed.getTime();
  const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));

  if (diffHours < 1) {
    return 'Vừa xong';
  }

  if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays} ngày trước`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} tháng trước`;
};

export const buildProjectOverviewMetrics = (
  personas: Persona[],
  respondents: Respondent[],
  studies: Study[],
): ProjectOverviewDetailMetrics => {
  const respondentsCount = respondents.length;
  const completedStudies = studies.filter((study) => study.status === 'completed');
  const draftStudies = studies.filter((study) => study.status === 'draft');
  const runningStudies = studies.filter((study) => study.status === 'running');
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
  const totalRespondentSignals = respondents.length;
  const respondentsPerPersona = personas.map((persona) => {
    const count = respondents.filter(
      (respondent) => respondent.persona_id === persona.id,
    ).length;

    return {
      id: persona.id,
      name: persona.name,
      segment: persona.segment,
      count,
      confidenceScore: persona.confidence_score,
      topChannel: persona.channels[0] ?? 'Chưa có',
      primaryNeed:
        persona.goals[0] ??
        persona.jtbd?.functional_job ??
        'Cần thêm thông tin về nhu cầu chính.',
    };
  });
  const channelMap = respondents.reduce<Record<string, number>>((accumulator, respondent) => {
    const channel = respondent.channel || 'Chưa có';
    accumulator[channel] = (accumulator[channel] ?? 0) + 1;
    return accumulator;
  }, {});
  const channelMix = Object.entries(channelMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([label, value]) => ({
      label,
      value,
      share: totalRespondentSignals ? Math.round((value / totalRespondentSignals) * 100) : 0,
    }));
  const studyTimeline = [...studies]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((study) => ({
      id: study.id,
      title: study.title,
      status: study.status,
      createdAt: study.created_at,
      questionCount: study.questions?.length ?? 0,
    }));
  const statusTone =
    readinessPercent >= 100
      ? 'Sẵn sàng xem kết quả mô phỏng'
      : readinessPercent >= 50
        ? 'Đang hoàn thiện thiết lập cốt lõi'
        : 'Cần thiết lập thêm trước khi dùng các mô-đun tiếp theo';
  const leadPersona = [...personas].sort(
    (a, b) => b.confidence_score - a.confidence_score,
  )[0];
  const mostActiveChannel = channelMix[0];
  const highlights: ProjectOverviewDetailMetrics['highlights'] = [];

  if (leadPersona) {
    highlights.push({
      title: `${leadPersona.segment} là nhóm nên ưu tiên đầu tiên`,
      detail: `Persona ${leadPersona.name} có độ tin cậy ${leadPersona.confidence_score}% và nổi bật với nhu cầu "${leadPersona.goals[0] ?? leadPersona.segment.toLowerCase()}".`,
      tone: 'success',
    });
  }

  if (mostActiveChannel) {
    highlights.push({
      title: `Kênh tín hiệu mạnh nhất hiện là ${mostActiveChannel.label}`,
      detail: `Kênh này chiếm khoảng ${mostActiveChannel.share}% tín hiệu tiếp cận trong bộ persona hiện tại, phù hợp để test creative đầu tiên.`,
      tone: 'info',
    });
  }

  if (runningStudies.length > 0) {
    highlights.push({
      title: 'Đã có nghiên cứu đang chạy để nối sang insight',
      detail: `${runningStudies.length} nghiên cứu đang ở trạng thái chạy, giúp overview không dừng ở mức thiết lập persona.`,
      tone: 'success',
    });
  } else if (draftStudies.length > 0) {
    highlights.push({
      title: 'Nghiên cứu đã được khởi tạo nhưng chưa chạy',
      detail: `${draftStudies.length} nghiên cứu còn ở dạng nháp. Nên hoàn thiện câu hỏi và chạy mô phỏng để mở khóa dashboard kết quả.`,
      tone: 'warning',
    });
  } else {
    highlights.push({
      title: 'Chưa có luồng nghiên cứu hoạt động',
      detail: 'Dự án mới có bối cảnh và chân dung. Cần thêm nghiên cứu để biến overview thành workspace có tín hiệu hành động.',
      tone: 'warning',
    });
  }

  const nextActions = [
    respondentsCount === 0
      ? 'Tạo nhóm respondents mô phỏng cho từng persona trước khi chạy nghiên cứu.'
      : `Duy trì tối thiểu ${Math.max(personas.length * 3, respondentsCount)} respondents để các so sánh giữa persona ổn định hơn.`,
    studies.length === 0
      ? 'Khởi tạo một study đầu tiên để kiểm thử concept hoặc pricing.'
      : completedStudies.length === 0
        ? 'Chạy ít nhất một study đã cấu hình để mở khóa insight và báo cáo.'
        : 'Đối chiếu kết quả study đã hoàn tất với persona confidence để chọn hướng thông điệp ưu tiên.',
    mostActiveChannel
      ? `Thiết kế biến thể thông điệp riêng cho kênh ${mostActiveChannel.label} thay vì dùng một creative chung cho mọi phân khúc.`
      : 'Bổ sung channel ưu tiên cho từng persona để hỗ trợ media planning sơ bộ.',
  ];

  const recentActivities: ProjectOverviewDetailMetrics['recentActivities'] = [];

  if (latestStudy) {
    recentActivities.push({
      id: `study-${latestStudy.id}`,
      title: `Cập nhật nghiên cứu ${studyStatusLabel(latestStudy.status)}`,
      detail: `${latestStudy.title} hiện có ${latestStudy.questions?.length ?? 0} câu hỏi đã cấu hình.`,
      timestamp: latestStudy.created_at,
    });
  }

  if (completedStudies.length > 0) {
    recentActivities.push({
      id: 'completed-study',
      title: 'Đã có kết quả mô phỏng sẵn sàng cho dashboard',
      detail: `${completedStudies.length} nghiên cứu đã hoàn tất và có thể dùng để tổng hợp insight sơ bộ.`,
      timestamp: completedStudies[0]?.created_at,
    });
  }

  recentActivities.push({
    id: 'persona-coverage',
    title: 'Bộ persona đã sẵn sàng cho các phân khúc chính',
    detail: `${personas.length} persona đang đại diện cho các nhu cầu khác nhau trong cùng một thị trường.`,
  });

  if (respondentsCount > 0) {
    recentActivities.push({
      id: 'respondent-pool',
      title: 'Nhóm respondents mô phỏng đã được nạp vào workspace',
      detail: `${respondentsCount} hồ sơ respondent đang hỗ trợ cho các study hiện tại.`,
    });
  }

  return {
    completedStudies,
    draftStudies,
    runningStudies,
    totalQuestions,
    avgConfidence,
    readinessSteps,
    readinessPercent,
    latestStudy,
    topChannels,
    personaHighlights,
    statusTone,
    respondentsPerPersona,
    channelMix,
    studyTimeline,
    highlights,
    nextActions,
    recentActivities,
  };
};

export const studyStatusLabel = (status: Study['status']) =>
  status === 'completed' ? 'hoàn tất' : status === 'running' ? 'đang chạy' : 'bản nháp';
