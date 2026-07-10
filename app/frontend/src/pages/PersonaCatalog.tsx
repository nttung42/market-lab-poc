import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  ExternalLink,
  FileText,
  Globe2,
  HeartPulse,
  Loader2,
  Lock,
  Megaphone,
  MessageCircle,
  Quote,
  Search,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  Tags,
  User,
  Zap,
} from 'lucide-react';
import { generatePersona, getProjectPersonas } from '../api/client';
import type { Persona, WeightedSignal } from '../types';

interface PersonaCatalogProps {
  projectId: string;
}

type PersonaTab = 'overview' | 'research' | 'buyer' | 'hybrid' | 'competitor';

const EXAMPLE_PROMPTS = [
  'Sinh viên năm cuối tại Việt Nam đang luyện IELTS Speaking với ngân sách hàng tháng hạn chế.',
  'Nhân sự trẻ đang so sánh các công cụ AI tăng năng suất cho một đội marketing nhỏ.',
  'Người mua mỹ phẩm Gen Z quan tâm tới routine chăm sóc da đơn giản, giá hợp lý và dễ duy trì.',
];

const personaTabs: { id: PersonaTab; label: string; note?: string }[] = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'research', label: 'Persona nghiên cứu' },
  { id: 'buyer', label: 'Persona người mua' },
  { id: 'hybrid', label: 'Persona kết hợp' },
  { id: 'competitor', label: 'Persona đối thủ', note: 'Sắp ra mắt' },
];

const personaCreationOptions: {
  id: Exclude<PersonaTab, 'overview'>;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  badgeClass: string;
  iconClass: string;
  icon: React.ReactNode;
  learnMore: {
    sourceLabel: string;
    sourceItems: string[];
    purpose: string;
    exampleOutput: string;
    features?: string[];
    note?: string;
  };
}[] = [
  {
    id: 'research',
    eyebrow: '1. Persona nghiên cứu',
    title: 'Persona từ dữ liệu thị trường bên ngoài',
    subtitle: 'Tạo từ khảo sát, phỏng vấn, báo cáo, social listening và tín hiệu công khai.',
    description:
      'Dùng khi dữ liệu nội bộ còn ít và bạn cần hiểu đối tượng tiềm năng, nỗi đau, xu hướng, động lực và các điểm bám thông điệp.',
    badgeClass: 'bg-ml-blue text-white',
    iconClass: 'bg-ml-blue-soft text-ml-blue',
    icon: <Search size={26} />,
    learnMore: {
      sourceLabel: 'Nguồn dữ liệu',
      sourceItems: [
        'Khảo sát, phỏng vấn, báo cáo thị trường và dữ liệu mạng xã hội',
        'Hashtag, xu hướng, đánh giá online và dữ liệu công khai',
        'Mô tả đối tượng mục tiêu và ghi chú nghiên cứu',
      ],
      purpose:
        'Giúp đội ngũ hiểu khách hàng tiềm năng, điểm đau, xu hướng hành vi và các hướng thông điệp ban đầu để kiểm thử.',
      exampleOutput:
        "Ví dụ: 'Người trẻ thành thị thích khám phá ẩm thực' với điểm đau, động lực, kênh và tín hiệu mua hàng cốt lõi.",
    },
  },
  {
    id: 'buyer',
    eyebrow: '2. Persona người mua',
    title: 'Persona từ dữ liệu kinh doanh thực',
    subtitle: 'Góc nhìn người mua từ CRM, bán hàng, phân tích, phản hồi và hành vi mua.',
    description:
      'Dùng khi đã có dữ liệu first-party để hiểu khách hàng tạo doanh thu, nhóm giá trị cao hoặc phân khúc dễ chuyển đổi.',
    badgeClass: 'bg-ml-success text-white',
    iconClass: 'bg-emerald-50 text-ml-success',
    icon: <BriefcaseBusiness size={26} />,
    learnMore: {
      sourceLabel: 'Nguồn dữ liệu',
      sourceItems: [
        'CRM, CSV, dữ liệu bán hàng và lịch sử mua',
        'Google Analytics, hành vi website và dữ liệu chiến dịch',
        'Phản hồi khách hàng, tín hiệu giữ chân và ghi chú chuyển đổi',
      ],
      purpose:
        'Giúp đội ngũ hiểu khách hàng hiện tại, nhóm giá trị cao, hành vi mua lại và rào cản chuyển đổi ngoài thực tế.',
      exampleOutput:
        "Ví dụ: 'Nhân viên văn phòng mua lặp lại' với thói quen mua, yếu tố tạo niềm tin, cơ hội trung thành và phản đối cốt lõi.",
    },
  },
  {
    id: 'hybrid',
    eyebrow: '3. Persona kết hợp',
    title: 'Kết hợp dữ liệu nghiên cứu và người mua',
    subtitle: 'Gộp tín hiệu thị trường và tín hiệu kinh doanh để tạo persona đáng tin cậy hơn.',
    description:
      'Dùng để đối chiếu insight thị trường với dữ liệu nội bộ nhằm xây dựng persona thực tế hơn cho nghiên cứu mô phỏng.',
    badgeClass: 'bg-violet-500 text-white',
    iconClass: 'bg-violet-50 text-violet-600',
    icon: <Zap size={26} />,
    learnMore: {
      sourceLabel: 'Nguồn dữ liệu',
      sourceItems: [
        'Kết hợp toàn bộ nguồn từ persona nghiên cứu và persona người mua',
        'So sánh giả định thị trường với bằng chứng kinh doanh',
        'Đối chiếu phân khúc tiềm năng với tín hiệu khách hàng hiện tại',
      ],
      purpose:
        'Tạo ra persona đáng tin cậy hơn, ít chủ quan hơn để so sánh insight trước khi dựng digital twin hoặc chạy kiểm thử thông điệp.',
      exampleOutput:
        "Ví dụ: So sánh 'phân khúc Gen Z tiềm năng' với 'bằng chứng doanh số từ nữ nhân viên văn phòng' để tìm điểm giao và khoảng trống.",
      features: ['Kiểm tra insight', 'Bảng so sánh', 'Điểm tin cậy', 'Tùy chọn xác thực'],
    },
  },
  {
    id: 'competitor',
    eyebrow: '4. Persona đối thủ',
    title: 'Phân tích đối thủ',
    subtitle: 'Lớp bổ sung để hiểu đối thủ đang nhắm tới ai và họ đang nói điều gì.',
    description:
      'Dùng để phân tích đối thủ qua domain, SEO, nội dung và tín hiệu về giá nhằm tìm ra khoảng trống thị trường và cơ hội định vị.',
    badgeClass: 'bg-zinc-500 text-white',
    iconClass: 'bg-zinc-100 text-zinc-600',
    icon: <Compass size={26} />,
    learnMore: {
      sourceLabel: 'Nguồn dữ liệu',
      sourceItems: [
        'Domain đối thủ, hiện diện mạng xã hội và từ khóa SEO',
        'Landing page, cấu trúc nội dung và trang giá',
        'Hướng thông điệp, mô thức ưu đãi và tín hiệu đối tượng',
      ],
      purpose:
        'Giúp đội ngũ nhận ra đối thủ đang nhắm tới ai, họ nhấn mạnh insight nào và khoảng trống thị trường nào còn bỏ ngỏ.',
      exampleOutput:
        'Đầu ra là giả thuyết persona theo góc nhìn đối thủ để tham khảo chiến lược, không phải tính năng cốt lõi của quy trình.',
      note: 'Tùy chọn: phù hợp như lớp tham khảo bổ sung, không phải mô-đun trung tâm của luồng tạo persona.',
    },
  },
];

const processingSteps = [
  'Đang ánh xạ bối cảnh đối tượng',
  'Đang cấu trúc tín hiệu hành vi',
  'Đang chấm điểm mức độ phù hợp kênh',
  'Đang chuẩn bị persona chỉ đọc',
];

const clampWeight = (weight: number) => Math.max(0, Math.min(100, Math.round(weight)));

const splitDemographic = (item: string) => {
  const [label, ...rest] = item.split(':');
  return {
    label: rest.length > 0 ? label.trim() : 'Chi tiết',
    value: rest.length > 0 ? rest.join(':').trim() : item,
  };
};

const getDemographicValue = (persona: Persona, key: string) => {
  const match = persona.demographics.find((item) =>
    item.toLowerCase().startsWith(`${key.toLowerCase()}:`),
  );
  return match?.split(':').slice(1).join(':').trim();
};

const fallbackSignals = (items?: string[], start = 88): WeightedSignal[] =>
  (items || []).slice(0, 6).map((label, index) => ({
    label,
    weight: Math.max(35, start - index * 9),
  }));

const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, icon, children, className = '' }) => (
  <section className={`bg-white border border-ml-border rounded-lg p-5 ${className}`}>
    <div className="flex items-center gap-2 mb-4">
      <div className="h-8 w-8 rounded-md bg-ml-blue-soft text-ml-blue-strong flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-sm font-black uppercase tracking-wide text-ml-ink">{title}</h2>
    </div>
    {children}
  </section>
);

const BulletList: React.FC<{ items?: string[]; tone?: 'blue' | 'green' | 'amber' | 'red' }> = ({
  items = [],
  tone = 'blue',
}) => {
  const colorMap = {
    blue: 'bg-ml-blue',
    green: 'bg-ml-success',
    amber: 'bg-ml-warning',
    red: 'bg-ml-danger',
  };

  if (items.length === 0) {
    return <p className="text-xs font-semibold text-ml-ink-muted">Chưa có tín hiệu nào được ánh xạ.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="relative pl-4 text-sm leading-relaxed font-medium text-ml-ink">
          <span className={`absolute left-0 top-2 h-1.5 w-1.5 rounded-full ${colorMap[tone]}`} />
          {item}
        </li>
      ))}
    </ul>
  );
};

const SignalBars: React.FC<{ signals?: WeightedSignal[]; limit?: number }> = ({ signals = [], limit = 6 }) => {
  const visible = signals.slice(0, limit);

  if (visible.length === 0) {
    return <p className="text-xs font-semibold text-ml-ink-muted">Chưa có tín hiệu trọng số nào được ánh xạ.</p>;
  }

  return (
    <div className="space-y-3">
      {visible.map((signal, index) => (
        <div key={`${signal.label}-${index}`} className="space-y-1">
          <div className="flex items-center justify-between gap-3 text-xs font-bold">
            <span className="text-ml-ink truncate">{signal.label}</span>
            <span className="text-ml-ink-muted tabular-nums">{clampWeight(signal.weight)}</span>
          </div>
          <div className="h-2 rounded-full bg-ml-surface overflow-hidden">
            <div
              className="h-full rounded-full bg-ml-blue"
              style={{ width: `${clampWeight(signal.weight)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const Chips: React.FC<{ items?: string[]; limit?: number }> = ({ items = [], limit = 12 }) => {
  const visible = items.slice(0, limit);

  if (visible.length === 0) {
    return <p className="text-xs font-semibold text-ml-ink-muted">Chưa có thẻ nào được ánh xạ.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="px-2.5 py-1 rounded-md bg-ml-surface border border-ml-border text-[11px] font-bold text-ml-ink-muted"
        >
          {item}
        </span>
      ))}
    </div>
  );
};

const KeyValueGrid: React.FC<{ items: { label: string; value?: string | number | null }[] }> = ({ items }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
    {items.map((item) => (
      <div key={item.label} className="border border-ml-border rounded-md p-3 bg-ml-surface/40">
        <div className="text-[10px] font-black uppercase tracking-wide text-ml-ink-muted">{item.label}</div>
        <div className="mt-1 text-sm font-bold text-ml-ink">{item.value || 'Không xác định'}</div>
      </div>
    ))}
  </div>
);

const IndustrySignals: React.FC<{ title: string; groups?: Record<string, WeightedSignal[]> }> = ({ title, groups = {} }) => {
  const entries = Object.entries(groups).filter(([, signals]) => signals.length > 0);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map(([group, signals]) => (
          <div key={group} className="border border-ml-border rounded-md p-3 bg-ml-surface/30">
            <div className="mb-2 text-[11px] font-black uppercase tracking-wide text-ml-ink">
              {group.replaceAll('_', ' ')}
            </div>
            <SignalBars signals={signals} limit={4} />
          </div>
        ))}
      </div>
    </div>
  );
};

const PersonaSubNav: React.FC<{
  activeTab: PersonaTab;
  onChange: (tab: PersonaTab) => void;
}> = ({ activeTab, onChange }) => (
  <div className="bg-white border border-ml-border rounded-lg p-1 flex flex-col md:flex-row md:items-center gap-1">
    {personaTabs.map((tab) => {
      const isActive = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`h-10 px-3 rounded-md text-xs font-black uppercase tracking-wide transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
            isActive
              ? 'bg-ml-blue text-white shadow-sm'
              : 'text-ml-ink-muted hover:bg-ml-surface hover:text-ml-ink'
          }`}
        >
          {tab.label}
          {tab.note && (
            <span
              className={`rounded px-1.5 py-0.5 text-[9px] font-black ${
                isActive ? 'bg-white/20 text-white' : 'bg-ml-surface text-ml-ink-muted'
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

interface PersonaOverviewProps {
  onSelect: (tab: PersonaTab) => void;
}

const PersonaOverview: React.FC<PersonaOverviewProps> = ({ onSelect }) => {
  const [selectedCard, setSelectedCard] = useState<Exclude<PersonaTab, 'overview'>>('research');

  const selectedOption = personaCreationOptions.find((option) => option.id === selectedCard) || personaCreationOptions[0];

  return (
    <div className="space-y-8">
      <div className="pt-3">
        <div className="text-xs font-black uppercase tracking-[0.18em] text-ml-blue">
          Khung tạo persona
        </div>
        <h1 className="mt-4 text-[28px] md:text-[40px] font-black tracking-normal leading-tight text-ml-ink">
          4 loại persona cho nghiên cứu mô phỏng
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {personaCreationOptions.map((option) => {
          const isSelected = selectedCard === option.id;
          return (
            <article
              key={`${option.title}-${option.id}`}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedCard(option.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedCard(option.id);
                }
              }}
              className={`bg-white border rounded-lg p-5 min-h-[300px] flex flex-col cursor-pointer select-none transition-all duration-200 outline-none hover:-translate-y-1 hover:shadow-md ${
                isSelected
                  ? 'border-ml-blue shadow-md bg-ml-blue-soft/10 ring-2 ring-ml-blue/10'
                  : 'border-ml-border hover:border-ml-blue/40'
              }`}
            >
              <span className={`self-start rounded-md px-3 py-2 text-xs font-black uppercase tracking-wide ${option.badgeClass}`}>
                {option.eyebrow}
              </span>
              <div className="mt-5 flex items-start gap-4">
                <div className={`h-11 w-11 rounded-md flex items-center justify-center shrink-0 ${option.iconClass}`}>
                  {option.icon}
                </div>
                <div>
                  <h2 className="text-lg font-black text-ml-ink leading-tight">{option.title}</h2>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wide text-ml-ink-muted">
                    {option.subtitle}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed font-medium text-ml-ink">
                {option.description}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
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
            <div className={`h-12 w-12 rounded-md flex items-center justify-center shrink-0 ${selectedOption.iconClass}`}>
              {selectedOption.icon}
            </div>
            <div>
              <div className={`inline-flex rounded-md px-3 py-1.5 text-[10px] font-black uppercase tracking-wide ${selectedOption.badgeClass}`}>
                {selectedOption.eyebrow}
              </div>
              <h2 className="mt-3 text-2xl font-black text-ml-ink">{selectedOption.title}</h2>
              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-ml-ink-muted">
                {selectedOption.subtitle}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="rounded-lg border border-ml-blue/20 bg-ml-blue-soft/50 px-4 py-3 text-xs font-bold leading-5 text-ml-blue max-w-xs">
              Dùng các tab phía trên để mở không gian làm việc chi tiết cho từng loại persona.
            </div>
            <button
              type="button"
              onClick={() => onSelect(selectedCard)}
              className="h-11 px-5 rounded-md bg-ml-blue hover:bg-ml-blue-strong text-white text-xs font-black uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
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
                  <li key={item} className="flex items-start gap-2 text-sm font-medium leading-6 text-ml-ink">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ml-blue" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedOption.learnMore.features && (
              <div className="rounded-lg border border-ml-border bg-white p-4">
                <div className="text-[10px] font-black uppercase tracking-wide text-ml-ink-muted">Tính năng</div>
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
              <div className="text-[10px] font-black uppercase tracking-wide text-ml-ink-muted">Mục đích</div>
              <p className="mt-3 text-sm font-medium leading-6 text-ml-ink">
                {selectedOption.learnMore.purpose}
              </p>
            </div>

            <div className="rounded-lg border border-ml-border bg-white p-4">
              <div className="text-[10px] font-black uppercase tracking-wide text-ml-ink-muted">Ví dụ đầu ra</div>
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

const PersonaMockPanel: React.FC<{
  title: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
}> = ({ title, description, badge, icon, comingSoon = false }) => (
  <section className="bg-white border border-ml-border rounded-lg overflow-hidden">
    <div className="bg-ml-ink text-white p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-md bg-white text-ml-blue flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-wide">
              {badge}
            </div>
            <h1 className="mt-3 text-3xl md:text-4xl font-black uppercase tracking-normal leading-tight">
              {title}
            </h1>
          </div>
        </div>
        <span className="self-start md:self-center px-3 py-1.5 rounded-md bg-ml-blue text-white text-[10px] font-black uppercase tracking-wide">
          Bản mô phỏng mẫu
        </span>
      </div>
      <p className="mt-5 max-w-3xl text-sm md:text-base font-semibold text-white/80 leading-relaxed">
        {description}
      </p>
    </div>

    <div className="p-6 md:p-7 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
      <div className="space-y-4">
        <div className="border border-ml-border rounded-lg p-5 bg-ml-surface/40">
          <h2 className="text-xs font-black uppercase tracking-wide text-ml-ink">Khung dữ liệu đầu vào</h2>
          <textarea
            rows={8}
            className="mt-3 w-full resize-none rounded-md border border-ml-border bg-white px-3 py-3 text-sm font-medium leading-relaxed text-ml-ink outline-none focus:border-ml-blue focus:ring-2 focus:ring-ml-blue/20"
            defaultValue="Mô tả phân khúc, bối cảnh mua hàng, rào cản, kết quả mong muốn và các kênh mà bạn muốn Market Lab mô phỏng."
            disabled={comingSoon}
          />
          <button
            type="button"
            disabled={comingSoon}
            className="mt-4 w-full h-11 rounded-md bg-ml-blue disabled:bg-ml-border disabled:text-ml-ink-muted text-white text-xs font-black uppercase tracking-wide"
          >
            {comingSoon ? 'Sắp ra mắt' : 'Tạo bản nháp'}
          </button>
        </div>
        <div className="border border-ml-warning/30 bg-amber-50 rounded-lg p-4 text-xs font-bold text-ml-warning leading-relaxed">
          Các bản nháp persona mô phỏng chỉ là giả định và cần được kiểm chứng bằng người thật trước khi dùng cho quyết định nghiên cứu.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['Hồ sơ có cấu trúc', 'Tác nhân ra quyết định', 'Phản đối', 'Tín hiệu kênh'].map((item) => (
          <div key={item} className="border border-ml-border rounded-lg p-5 bg-white">
            <div className="text-[10px] font-black uppercase tracking-wide text-ml-ink-muted">{item}</div>
            <div className="mt-3 h-2 rounded-full bg-ml-surface overflow-hidden">
              <div className="h-full w-2/3 bg-ml-blue" />
            </div>
            <p className="mt-4 text-sm font-semibold leading-relaxed text-ml-ink-muted">
              Nội dung minh họa tạm thời sẽ được thay bằng dữ liệu của luồng persona tương ứng.
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const PersonaDetail: React.FC<{ persona: Persona }> = ({ persona }) => {
  const profile = persona.insight_profile;
  const age = getDemographicValue(persona, 'Age');
  const location = getDemographicValue(persona, 'Location');
  const occupation = getDemographicValue(persona, 'Occupation') || profile?.work_lifestyle?.occupation;
  const communication = profile?.communication || fallbackSignals(persona.channels, 92);
  const validation = persona.validation;

  return (
    <div className="space-y-5">
      <section className="bg-white border border-ml-border rounded-lg overflow-hidden">
        <div className="bg-ml-ink text-white p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-4 min-w-0">
              <div className="h-16 w-16 rounded-full bg-white text-ml-blue flex items-center justify-center shrink-0">
                <User size={32} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-ml-blue text-white text-[10px] font-black uppercase tracking-wide">
                    Persona mô phỏng
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-wide flex items-center gap-1">
                    <Lock size={11} />
                    Chỉ đọc
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-wide">
                    Cần xác thực bởi người thật
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-normal leading-tight">
                  {persona.name}
                </h1>
                <p className="mt-2 text-sm md:text-base font-semibold text-white/80">
                  {persona.segment}
                  {age ? ` / ${age}` : ''}
                  {location ? ` / ${location}` : ''}
                </p>
              </div>
            </div>
            <div className="w-full lg:w-52 bg-white/10 border border-white/20 rounded-lg p-4">
              <div className="text-[10px] font-black uppercase tracking-wide text-white/70">Độ tin cậy</div>
              <div className="mt-1 text-3xl font-black text-white">{Math.round(persona.confidence_score)}%</div>
              <div className="mt-3 h-2 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-ml-blue" style={{ width: `${clampWeight(persona.confidence_score)}%` }} />
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 md:p-7 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="flex gap-3">
            <Quote size={22} className="text-ml-blue shrink-0 mt-1" />
            <p className="text-lg md:text-xl font-semibold leading-relaxed text-ml-ink">"{persona.quote}"</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {persona.demographics.slice(0, 6).map((item) => {
              const parsed = splitDemographic(item);
              return (
                <div key={item} className="border border-ml-border rounded-md p-3 bg-ml-surface/50">
                  <div className="text-[10px] font-black uppercase tracking-wide text-ml-ink-muted">{parsed.label}</div>
                  <div className="text-sm font-bold text-ml-ink mt-0.5">{parsed.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Section title="Thông tin hồ sơ" icon={<FileText size={17} />}>
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-1">Tóm tắt</h3>
              <p className="text-sm leading-relaxed font-medium text-ml-ink">
                {profile?.profile_information?.summary || persona.assumptions[0] || 'Chưa có tóm tắt hồ sơ mô phỏng.'}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-1">Khát vọng cá nhân</h3>
              <p className="text-sm leading-relaxed font-medium text-ml-ink">
                {profile?.profile_information?.personal_aspirations || persona.goals.join(' ')}
              </p>
            </div>
          </div>
        </Section>

        <Section title="Công việc và lối sống" icon={<BriefcaseBusiness size={17} />}>
          <KeyValueGrid
            items={[
              { label: 'Nghề nghiệp', value: occupation },
              { label: 'Ngành', value: profile?.work_lifestyle?.industry },
              { label: 'Thu nhập', value: profile?.work_lifestyle?.income || getDemographicValue(persona, 'Income') },
              { label: 'Tình trạng', value: profile?.work_lifestyle?.marital_status },
              { label: 'Nhà ở', value: profile?.work_lifestyle?.housing_status },
              { label: 'Khu vực', value: location },
            ]}
          />
        </Section>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Section title="Hành vi mua hàng" icon={<ShoppingBag size={17} />}>
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-2">Yếu tố quyết định</h3>
              <BulletList items={profile?.buying_behavior?.purchase_decision_factors || persona.buying_behavior} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-2">Tác nhân kích hoạt</h3>
              <BulletList items={profile?.buying_behavior?.triggers || persona.decision_rules} tone="green" />
            </div>
          </div>
        </Section>

        <Section title="Động lực tâm lý" icon={<HeartPulse size={17} />}>
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-2">Mục tiêu</h3>
              <BulletList items={profile?.psychological_drivers?.goals || persona.goals} tone="green" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-2">Nhu cầu chính</h3>
              <BulletList items={profile?.psychological_drivers?.key_needs || persona.product_fit?.must_haves} />
            </div>
          </div>
        </Section>

        <Section title="Rào cản chính" icon={<ShieldAlert size={17} />}>
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-2">Thách thức cốt lõi</h3>
              <BulletList items={profile?.key_obstacles?.core_challenges || persona.pain_points} tone="red" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-2">Rào cản cảm nhận</h3>
              <BulletList items={profile?.key_obstacles?.perceived_barriers || persona.objections} tone="amber" />
            </div>
          </div>
        </Section>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Section title="Giao tiếp và truyền thông" icon={<MessageCircle size={17} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-3">Giao tiếp</h3>
              <SignalBars signals={communication} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-3">Loại nội dung</h3>
              <SignalBars signals={profile?.media_digital?.content_types} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-3">Nguồn truyền thông</h3>
              <SignalBars signals={profile?.media_digital?.media_news_sources} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-3">Mạng xã hội</h3>
              <SignalBars signals={profile?.media_digital?.social_networks} />
            </div>
          </div>
        </Section>

        <Section title="Thương hiệu và thương mại" icon={<Tags size={17} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-3">Thương hiệu</h3>
              <SignalBars signals={profile?.brand_commerce?.brands} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-3">Website đã truy cập</h3>
              <SignalBars signals={profile?.media_digital?.websites_visited} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-3">Sản phẩm</h3>
              <SignalBars signals={profile?.brand_commerce?.products || fallbackSignals(persona.product_fit?.must_haves)} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-3">Website mua sắm</h3>
              <SignalBars signals={profile?.brand_commerce?.shopping_websites} />
            </div>
          </div>
        </Section>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Section title="Tín hiệu số" icon={<Globe2 size={17} />}>
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-2">Hashtag</h3>
              <Chips items={profile?.media_digital?.hashtags} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-2">Subreddit</h3>
              <Chips items={profile?.media_digital?.subreddits} />
            </div>
          </div>
        </Section>

        <Section title="Tương tác website" icon={<Activity size={17} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <KeyValueGrid
              items={[
                { label: 'Ngày đầu tiên', value: profile?.website_interaction?.first_interaction_day },
                { label: 'Giờ đầu tiên', value: profile?.website_interaction?.first_interaction_time },
              ]}
            />
            <div>
              <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-3">Nguồn ảnh hưởng chính</h3>
              <SignalBars signals={profile?.website_interaction?.influential_resources} />
            </div>
          </div>
        </Section>
      </section>

      <Section title="Sở thích và ưu tiên" icon={<Compass size={17} />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-3">Thể thao</h3>
            <SignalBars signals={profile?.preferences?.sports} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-3">Giá trị</h3>
            <SignalBars signals={profile?.preferences?.values || fallbackSignals(persona.psychographics?.core_values)} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-3">Sở thích</h3>
            <SignalBars signals={profile?.preferences?.hobbies} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-3">Địa điểm hay ghé</h3>
            <SignalBars signals={profile?.preferences?.places_likely_to_visit} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-3">Sự kiện</h3>
            <SignalBars signals={profile?.preferences?.events_conferences} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-3">Công cụ</h3>
            <SignalBars signals={profile?.preferences?.tools} />
          </div>
        </div>
      </Section>

      <Section title="Chủ đề cộng hưởng" icon={<Megaphone size={17} />}>
        <SignalBars signals={profile?.website_interaction?.resonating_topics || fallbackSignals(persona.motivations, 90)} limit={10} />
      </Section>

      <Section title="Insight theo ngành" icon={<BarChart3 size={17} />}>
        <div className="space-y-6">
          <IndustrySignals title="Thời trang" groups={profile?.industry_specific_insights?.apparel_fashion} />
          <IndustrySignals title="Đồ thể thao" groups={profile?.industry_specific_insights?.sporting_goods} />
          <IndustrySignals title="Hàng tiêu dùng" groups={profile?.industry_specific_insights?.consumer_goods} />
        </div>
      </Section>

      <Section title="Xác thực và giả định" icon={<CheckCircle2 size={17} />}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <h3 className="text-xs font-black uppercase tracking-wide text-ml-ink-muted mb-2">Giả định mô phỏng</h3>
            <BulletList items={persona.assumptions} />
          </div>
          <div className="border border-ml-border rounded-md p-4 bg-ml-surface/40">
            <div className="text-[10px] font-black uppercase tracking-wide text-ml-ink-muted">Xác thực bởi con người</div>
            <div className="mt-1 text-lg font-black text-ml-ink">
              {validation?.is_human_validated ? 'Đã xác thực' : 'Chưa xác thực'}
            </div>
            <div className="mt-3 text-xs font-semibold text-ml-ink-muted">
              {(validation?.evidence_sources || ['Sinh từ prompt mô phỏng']).join(', ')}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export const PersonaCatalog: React.FC<PersonaCatalogProps> = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState<PersonaTab>('overview');
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(EXAMPLE_PROMPTS[0]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPersona = useMemo(
    () => personas.find((persona) => persona.id === selectedPersonaId) || personas[0] || null,
    [personas, selectedPersonaId],
  );

  useEffect(() => {
    let cancelled = false;

    void Promise.resolve().then(async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getProjectPersonas(projectId);

        if (cancelled) {
          return;
        }

        setPersonas(data);
        setSelectedPersonaId((current) => current || data[0]?.id || null);
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Không thể tải danh sách persona.';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const handleGenerate = async (event: React.FormEvent) => {
    event.preventDefault();
    const customPrompt = prompt.trim();

    if (customPrompt.length < 5) {
      setError('Mô tả đối tượng phải có ít nhất 5 ký tự.');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const persona = await generatePersona(projectId, customPrompt);
      setPersonas((current) => [persona, ...current.filter((item) => item.id !== persona.id)]);
      setSelectedPersonaId(persona.id);
      setActiveTab('research');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tạo persona.';
      setError(message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 space-y-6 text-ml-ink">
      <PersonaSubNav activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && <PersonaOverview onSelect={setActiveTab} />}

      {activeTab === 'buyer' && (
        <PersonaMockPanel
          title="Persona người mua"
          badge="Tín hiệu mua hàng"
          description="Không gian tạm cho việc tạo persona thiên về khách hàng, hành vi xã hội và hành vi mua. Phần mô phỏng này giữ luồng làm việc rõ ràng trong khi backend còn được hoàn thiện."
          icon={<ShoppingBag size={28} />}
        />
      )}

      {activeTab === 'hybrid' && (
        <PersonaMockPanel
          title="Persona kết hợp"
          badge="Mô hình tín hiệu hỗn hợp"
          description="Kết hợp ghi chú đối tượng, hành vi website, tiêu chí ra quyết định và giả định về kênh thành một bản nháp persona thực tế cho kiểm thử concept."
          icon={<Tags size={28} />}
        />
      )}

      {activeTab === 'competitor' && (
        <PersonaMockPanel
          title="Persona đối thủ"
          badge="Tín hiệu đối thủ"
          description="Sắp ra mắt: luồng phân tích domain đối thủ để khám phá persona mục tiêu, ngữ cảnh từ khóa và các giả định chiến lược marketing."
          icon={<Compass size={28} />}
          comingSoon
        />
      )}

      {activeTab === 'research' && (
        <>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-5 border-b border-ml-border">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-ml-blue-soft text-ml-blue-strong text-[10px] font-black uppercase tracking-wide border border-ml-blue/20">
                <Sparkles size={13} />
                Trí tuệ persona
              </div>
              <h1 className="mt-3 text-[28px] md:text-[36px] font-black uppercase tracking-normal leading-tight">
                Trình tạo persona AI
              </h1>
              <p className="mt-2 text-sm font-semibold text-ml-ink-muted max-w-2xl leading-relaxed">
                Chỉ từ một mô tả đối tượng, hệ thống tạo ra hồ sơ persona mô phỏng có cấu trúc để kiểm thử thông điệp.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-ml-ink-muted">
              <Lock size={14} className="text-ml-blue" />
              Kết quả chỉ đọc
            </div>
          </div>

          {error && (
            <div className="p-4 bg-ml-danger/10 border border-ml-danger/20 text-ml-danger rounded-lg text-xs font-bold flex items-start gap-2">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
                <div className="h-80 bg-ml-border rounded-lg" />
                <div className="h-[620px] bg-ml-border rounded-lg" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
              <aside className="space-y-5 lg:sticky lg:top-32">
                <section className="bg-white border border-ml-border rounded-lg p-5">
                  <form onSubmit={handleGenerate} className="space-y-4">
                    <div>
                      <label htmlFor="persona-prompt" className="text-xs font-black uppercase tracking-wide text-ml-ink">
                        Mô tả đối tượng
                      </label>
                      <textarea
                        id="persona-prompt"
                        value={prompt}
                        onChange={(event) => setPrompt(event.target.value)}
                        rows={7}
                        className="mt-2 w-full resize-none rounded-md border border-ml-border bg-white px-3 py-3 text-sm font-medium leading-relaxed text-ml-ink outline-none transition focus:border-ml-blue focus:ring-2 focus:ring-ml-blue/20"
                        disabled={generating}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={generating}
                      className="w-full h-11 rounded-md bg-ml-blue hover:bg-ml-blue-strong disabled:bg-ml-border disabled:text-ml-ink-muted text-white text-xs font-black uppercase tracking-wide flex items-center justify-center gap-2 transition-colors"
                    >
                      {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                      Tạo persona
                    </button>
                  </form>
                </section>

                <section className="bg-white border border-ml-border rounded-lg p-5">
                  <h2 className="text-xs font-black uppercase tracking-wide text-ml-ink mb-3">Gợi ý prompt</h2>
                  <div className="space-y-2">
                    {EXAMPLE_PROMPTS.map((example) => (
                      <button
                        key={example}
                        type="button"
                        onClick={() => setPrompt(example)}
                        className="w-full text-left p-3 rounded-md border border-ml-border hover:border-ml-blue hover:bg-ml-blue-soft/30 transition-colors text-xs font-semibold leading-relaxed text-ml-ink-muted"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="bg-white border border-ml-border rounded-lg p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h2 className="text-xs font-black uppercase tracking-wide text-ml-ink">Hồ sơ đã tạo</h2>
                    <span className="text-[10px] font-black text-ml-blue">{personas.length}</span>
                  </div>
                  {personas.length === 0 ? (
                    <div className="rounded-md border border-dashed border-ml-border p-4 text-center">
                      <Search className="mx-auto text-ml-ink-muted mb-2" size={20} />
                      <p className="text-xs font-semibold text-ml-ink-muted">Chưa có persona nào được tạo.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                      {personas.map((persona) => (
                        <button
                          key={persona.id}
                          type="button"
                          onClick={() => setSelectedPersonaId(persona.id)}
                          className={`w-full text-left rounded-md border p-3 transition-colors ${
                            selectedPersona?.id === persona.id
                              ? 'border-ml-blue bg-ml-blue-soft/40'
                              : 'border-ml-border hover:border-ml-blue/50 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-sm font-black uppercase text-ml-ink truncate">{persona.name}</div>
                              <div className="text-[11px] font-bold text-ml-ink-muted truncate mt-0.5">{persona.segment}</div>
                            </div>
                            <ExternalLink size={14} className="text-ml-ink-muted shrink-0 mt-0.5" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              </aside>

              <main className="min-w-0">
                {generating ? (
                  <section className="bg-white border border-ml-border rounded-lg p-8 min-h-[620px] flex flex-col justify-center">
                    <div className="max-w-xl mx-auto text-center">
                      <div className="h-16 w-16 rounded-full bg-ml-blue-soft text-ml-blue mx-auto flex items-center justify-center">
                        <Loader2 size={34} className="animate-spin" />
                      </div>
                      <h2 className="mt-5 text-2xl font-black uppercase tracking-normal text-ml-ink">
                        Đang dựng persona
                      </h2>
                      <p className="mt-2 text-sm font-semibold text-ml-ink-muted">
                        Kết quả mô phỏng sẽ ở chế độ chỉ đọc và cần xác thực bằng người thật.
                      </p>
                      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                        {processingSteps.map((step, index) => (
                          <div key={step} className="border border-ml-border rounded-md p-3 bg-ml-surface/40 flex items-center gap-3">
                            <div className="h-7 w-7 rounded-md bg-ml-blue text-white flex items-center justify-center text-xs font-black">
                              {index + 1}
                            </div>
                            <span className="text-xs font-black uppercase tracking-wide text-ml-ink">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                ) : selectedPersona ? (
                  <PersonaDetail persona={selectedPersona} />
                ) : (
                  <section className="bg-white border border-ml-border rounded-lg min-h-[620px] flex items-center justify-center p-8 text-center">
                    <div className="max-w-md">
                      <Zap className="mx-auto text-ml-blue mb-4" size={42} />
                      <h2 className="text-2xl font-black uppercase tracking-normal text-ml-ink">Sẵn sàng tạo persona</h2>
                      <p className="mt-2 text-sm font-semibold text-ml-ink-muted">
                        Hãy nhập mô tả đối tượng để tạo persona mô phỏng đầu tiên ở chế độ chỉ đọc.
                      </p>
                    </div>
                  </section>
                )}
              </main>
            </div>
          )}
        </>
      )}
    </div>
  );
};
