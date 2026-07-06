import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Cpu,
  FlaskConical,
  GitCompare,
  GraduationCap,
  LayoutDashboard,
  Mail,
  MessagesSquare,
  Plug,
  Plus,
  ScanFace,
  Smile,
  Target,
  UsersRound,
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

interface IconCard {
  title: string;
  body: string;
  icon: LucideIcon;
}

const navItems = [
  { label: 'Tính năng', href: '#tinhnang' },
  { label: 'Quy trình', href: '#quytrinh' },
  { label: 'Khoa học', href: '#khoahoc' },
  { label: 'Đánh giá', href: '#danhgia' },
  { label: 'FAQ', href: '#faq' },
];

const universities = ['ĐH Quốc gia Hà Nội', 'ĐH Ngoại thương', 'RMIT Vietnam', 'VinUniversity'];

const platformCards: IconCard[] = [
  {
    title: 'Tạo AI Persona',
    body: 'Xây dựng hồ sơ người tiêu dùng chi tiết dựa trên dữ liệu nhân khẩu học, tâm lý học và hành vi. Persona đa chiều, thực tế và có thể tái sử dụng.',
    icon: UsersRound,
  },
  {
    title: 'Focus Group ảo',
    body: 'Tổ chức nhóm thảo luận với 8-20 AI Persona, nhận phản hồi định tính sâu trong vài phút. Không cần lên lịch, không cần địa điểm.',
    icon: MessagesSquare,
  },
  {
    title: 'Kiểm thử chiến dịch',
    body: 'Upload brief, slogan, hay creative concept - AI mô phỏng phản ứng của khách hàng mục tiêu trước khi tiền thật vào quảng cáo.',
    icon: Target,
  },
  {
    title: 'Khảo sát & Phân tích',
    body: 'Chạy khảo sát với cả AI Persona và người thật, so sánh kết quả và xuất báo cáo chi tiết. Tích hợp đa kênh, dễ dàng quản lý.',
    icon: FlaskConical,
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Xác định mục tiêu',
    body: 'Nhập mục tiêu nghiên cứu, tải lên brief hoặc bản thảo khảo sát. AI sẽ đề xuất kế hoạch nghiên cứu phù hợp và tối ưu nhất cho bạn.',
    icon: Target,
  },
  {
    number: '02',
    title: 'Chạy giả lập AI',
    body: 'Kích hoạt AI Persona, triển khai Focus Group ảo hoặc khảo sát tự động - đơn lẻ hoặc kết hợp. Chạy song song nhiều kịch bản cùng lúc.',
    icon: Cpu,
  },
  {
    number: '03',
    title: 'Phân tích & Xuất báo cáo',
    body: 'Nhận insight chi tiết, so sánh phản hồi AI vs người thật, xuất báo cáo PDF/Excel chỉ 1 click. Sẵn sàng trình bày với stakeholder ngay.',
    icon: BarChart3,
  },
];

const featureCards: IconCard[] = [
  {
    title: 'Persona Builder AI',
    body: 'Tạo persona đa chiều với lịch sử, thói quen, niềm tin và giá trị cốt lõi. Mỗi persona là một con người hoàn chỉnh, không chỉ là dữ liệu.',
    icon: ScanFace,
  },
  {
    title: 'Virtual Focus Group',
    body: 'Điều phối buổi thảo luận nhóm với tối đa 20 AI Persona, có transcript đầy đủ và phân tích tự động sau buổi thảo luận.',
    icon: MessagesSquare,
  },
  {
    title: 'A/B Testing AI',
    body: 'Kiểm thử hai phiên bản concept, thông điệp hoặc creative - AI cho biết cái nào hiệu quả hơn với từng phân khúc cụ thể.',
    icon: GitCompare,
  },
  {
    title: 'Phân tích cảm xúc',
    body: 'Đo lường cảm xúc sau mỗi câu trả lời - tích cực, tiêu cực, lưỡng lự. Hiểu sâu hơn những gì khách hàng thực sự cảm thấy.',
    icon: Smile,
  },
  {
    title: 'Dashboard thời gian thực',
    body: 'Xem kết quả tổng hợp, biểu đồ và trend ngay khi simulation đang chạy. Không cần đợi đến khi kết thúc mới có insight.',
    icon: LayoutDashboard,
  },
  {
    title: 'Tích hợp & xuất dữ liệu',
    body: 'Kết nối với Google Sheets, Notion, Slack. Xuất PDF, CSV, PowerPoint chỉ trong một thao tác, sẵn sàng chia sẻ với đội ngũ.',
    icon: Plug,
  },
];

const benefits = [
  {
    value: '90%',
    title: 'Tiết kiệm chi phí nghiên cứu',
    body: 'So với phương pháp truyền thống tuyển respondent và thuê agency nghiên cứu thị trường chuyên nghiệp.',
  },
  {
    value: '4 giờ',
    title: 'Thay vì 4 tuần',
    body: 'Hoàn thành một nghiên cứu Focus Group đầy đủ trong buổi sáng thay vì chờ cả tháng để có kết quả.',
  },
  {
    value: '3x',
    title: 'Nhiều insight hơn',
    body: 'Chạy nhiều kịch bản kiểm thử song song, nhận gấp 3 lần insight từ cùng một ngân sách nghiên cứu.',
  },
];

const testimonials = [
  {
    quote:
      'Thay vì mất 2 tuần để test 1 concept, bây giờ tôi test 3 concept trong một buổi sáng. Market Lab thay đổi hoàn toàn cách chúng tôi làm research trước khi chi tiền.',
    initials: 'NA',
    name: 'Nguyễn Anh Thư',
    role: 'Marketing Manager tại FMCG công ty',
  },
  {
    quote:
      'Là startup, chúng tôi không có ngân sách thuê agency. Market Lab giúp chúng tôi validate product-market fit nhanh chóng và với chi phí rất hợp lý.',
    initials: 'MK',
    name: 'Minh Khoa Nguyễn',
    role: 'Founder startup EdTech',
  },
  {
    quote:
      'Khách hàng của chúng tôi ngạc nhiên khi nhận báo cáo research sau 24 giờ thay vì 3 tuần. Market Lab giúp agency chúng tôi cạnh tranh tốt hơn.',
    initials: 'TH',
    name: 'Trần Hương Giang',
    role: 'Director tại Brand Research Agency',
  },
];

const scienceCards = [
  {
    value: '94%',
    title: 'Độ tương quan',
    body: 'So sánh với nghiên cứu thực tế cho thấy AI Persona phản hồi gần 94% tương đồng với người thật trong cùng phân khúc.',
  },
  {
    value: '1.000+',
    title: 'Mô phỏng/ngày',
    body: 'Kiến trúc agent phân tán cho phép chạy hàng nghìn simulation song song mà không mất độ chính xác hay hiệu suất.',
  },
  {
    value: 'Peer-reviewed',
    title: 'Research',
    body: 'Phương pháp được kiểm chứng qua các công bố khoa học về Generative Agent Simulation và Synthetic User behavior.',
  },
  {
    value: 'Liên tục',
    title: 'Học hỏi & Cải tiến',
    body: 'Mô hình được cập nhật định kỳ từ dữ liệu thực tế mới, đảm bảo persona luôn phản ánh hành vi người tiêu dùng hiện tại.',
  },
];

const faqs = [
  {
    question: 'Market Lab có khác gì so với khảo sát truyền thống?',
    answer:
      'Thay vì chờ 2-4 tuần để tuyển người tham gia, khảo sát và tổng hợp kết quả, Market Lab cho phép bạn nhận insight trong vài giờ với độ chính xác cao nhờ AI Persona được huấn luyện trên dữ liệu hành vi thực tế.',
  },
  {
    question: 'AI Persona có đáng tin cậy không?',
    answer:
      'Mô hình của chúng tôi đã được kiểm chứng với độ tương quan 94% so với phản hồi từ người thật trong cùng phân khúc. Mỗi kết quả đều kèm mức độ tin cậy để bạn biết khi nào nên kiểm chứng thêm.',
  },
  {
    question: 'Tôi có cần kỹ năng kỹ thuật để dùng không?',
    answer:
      'Không. Market Lab được thiết kế cho Marketer, Researcher và Founder - giao diện kéo-thả, không cần code. Mọi tính năng đều có thể dùng ngay mà không cần đào tạo.',
  },
  {
    question: 'Tôi có thể dùng kết hợp AI Persona và người thật không?',
    answer:
      'Có. Bạn có thể chạy song song khảo sát AI và khảo sát người thật, sau đó so sánh và xác thực kết quả. Tính năng này giúp bạn vừa nhanh vừa chắc chắn cho các quyết định quan trọng.',
  },
  {
    question: 'Giá như thế nào? Có dùng thử miễn phí không?',
    answer:
      'Có gói Free với 50 simulation/tháng. Gói Pro từ 990.000đ/tháng với không giới hạn persona và xuất báo cáo không giới hạn. Bạn chỉ nâng cấp khi thấy giá trị rõ ràng.',
  },
  {
    question: 'Dữ liệu của tôi có được bảo mật không?',
    answer:
      'Có. Toàn bộ dữ liệu được mã hóa end-to-end và lưu trữ trên server tại Việt Nam, tuân thủ quy định bảo vệ dữ liệu cá nhân hiện hành.',
  },
];

const dashboardPersonas = [
  ['LA', 'Lan Anh', '28 · HN', 'bg-ml-blue'],
  ['MĐ', 'Minh Đức', '34 · HCM', 'bg-ml-success'],
  ['HH', 'Hồng Hoa', '41 · ĐN', 'bg-ml-warning'],
  ['VH', 'Văn Hùng', '26 · HCM', 'bg-ml-ink'],
  ['TM', 'Thị Mai', '23 · HN', 'bg-ml-danger'],
  ['VT', 'Văn Thành', '37 · CT', 'bg-ml-blue-strong'],
];

const footerGroups = [
  { title: 'Sản phẩm', links: ['Bảng giá', 'Nền tảng', 'Tính năng', 'Tích hợp'] },
  { title: 'Tài nguyên', links: ['Tài liệu', 'Use Cases', 'Blog', 'Nghiên cứu khoa học'] },
  { title: 'Công ty', links: ['Về chúng tôi', 'FAQ', 'Liên hệ', 'Tuyển dụng'] },
];

const SectionHeader = ({ eyebrow, title, body }: { eyebrow?: string; title: string; body?: string }) => (
  <div className="mx-auto mb-12 max-w-3xl text-center">
    {eyebrow && (
      <span className="mb-4 inline-flex rounded-full bg-ml-blue-soft px-4 py-1.5 text-xs font-black uppercase text-ml-blue-strong">
        {eyebrow}
      </span>
    )}
    <h2 className="text-3xl font-black leading-tight text-ml-ink md:text-[38px]">{title}</h2>
    {body && <p className="mt-4 text-base font-semibold leading-7 text-ml-ink-muted">{body}</p>}
  </div>
);

const IconCardView = ({ title, body, icon: Icon }: IconCard) => (
  <article className="rounded-lg border border-ml-border bg-white p-7 shadow-sm transition-colors hover:border-ml-blue/40">
    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-ml-blue-soft text-ml-blue">
      <Icon size={24} />
    </div>
    <h3 className="text-lg font-black text-ml-ink">{title}</h3>
    <p className="mt-3 text-sm font-medium leading-7 text-ml-ink-muted">{body}</p>
  </article>
);

export const LandingPage = ({ onStart }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-white text-ml-ink selection:bg-ml-blue-soft selection:text-ml-blue-strong">
      <header className="sticky top-0 z-40 border-b border-ml-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-5 md:px-8">
          <a href="#/landing" className="flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ml-blue focus:ring-offset-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ml-blue text-white">
              <FlaskConical size={22} strokeWidth={2.4} />
            </span>
            <span className="text-xl font-black leading-none">Market Lab</span>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-black text-ml-ink-muted md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-ml-blue">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onStart}
              className="hidden rounded-lg px-3 py-2 text-sm font-black text-ml-ink transition-colors hover:bg-ml-surface sm:inline-flex"
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={onStart}
              className="rounded-lg bg-ml-blue px-4 py-3 text-sm font-black text-white shadow-sm transition-colors hover:bg-ml-blue-strong sm:px-5"
            >
              Dùng thử miễn phí
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-5 pb-16 pt-20 text-center md:px-8 md:pt-24">
          <div className="inline-flex items-center gap-2 rounded-full bg-ml-blue-soft px-5 py-2 text-sm font-black text-ml-blue-strong">
            <span className="h-2 w-2 rounded-full bg-ml-blue" aria-hidden="true" />
            Được tinh chỉnh tối ưu cho Văn hóa &amp; Hành vi người Việt
          </div>

          <h1 className="mx-auto mt-7 max-w-5xl text-[42px] font-black leading-[1.04] tracking-normal text-ml-ink md:text-[64px]">
            Mô phỏng khách hàng Việt.
            <br />
            <span className="italic text-ml-blue">Thử nghiệm quyết định</span> trước khi tung sản phẩm.
          </h1>

          <p className="mx-auto mt-7 max-w-[720px] text-lg font-semibold leading-8 text-ml-ink-muted">
            Đừng phỏng đoán phản ứng của thị trường. Hãy hỏi các{' '}
            <strong className="font-black text-ml-ink">AI Persona siêu thực</strong> được huấn luyện dựa trên dữ liệu văn hóa, thu nhập,
            thói quen tiêu dùng của người Việt từ cả 3 miền Bắc - Trung - Nam.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex min-h-14 items-center justify-center rounded-lg bg-ml-blue px-8 text-base font-black text-white shadow-sm transition-colors hover:bg-ml-blue-strong"
            >
              Bắt đầu chạy thử nghiệm ngay
            </button>
            <a
              href="#quytrinh"
              className="inline-flex min-h-14 items-center justify-center rounded-lg border border-ml-border bg-white px-8 text-base font-black text-ml-ink shadow-sm transition-colors hover:border-ml-blue/30 hover:bg-ml-blue-soft/30"
            >
              Xem cách hoạt động
            </a>
          </div>

          <div className="mt-16 border-t border-ml-border pt-8">
            <p className="text-xs font-black uppercase text-ml-ink-muted">
              Mô phỏng dựa trên dữ liệu học thuật &amp; kiểm định thực tế cùng các chuyên gia từ
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {universities.map((name) => (
                <span key={name} className="inline-flex items-center gap-2 text-base font-black text-ml-ink-muted">
                  <GraduationCap size={20} />
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8" id="tinhnang">
          <SectionHeader
            eyebrow="Nền tảng"
            title="Market Lab giúp bạn làm gì?"
            body="Từ ý tưởng đến insight - Market Lab thay thế quy trình nghiên cứu truyền thống tốn kém và chậm chạp bằng AI chính xác, nhanh và có thể lặp lại."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {platformCards.map((card) => (
              <IconCardView key={card.title} {...card} />
            ))}
          </div>
        </section>

        <section className="bg-ml-surface" id="quytrinh">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
            <SectionHeader title="Quy trình 3 bước đơn giản" body="Không cần chờ đợi. Không cần tuyển respondent. Kết quả trong vài phút." />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {processSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <article key={step.number} className="rounded-lg border border-ml-border bg-white p-7">
                    <div className="text-5xl font-black leading-none text-ml-border">{step.number}</div>
                    <div className="my-5 flex h-12 w-12 items-center justify-center rounded-lg bg-ml-blue-soft text-ml-blue">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-black text-ml-ink">{step.title}</h3>
                    <p className="mt-3 text-sm font-medium leading-7 text-ml-ink-muted">{step.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <SectionHeader
            eyebrow="Tính năng"
            title="Tính năng nổi bật"
            body="Mọi công cụ bạn cần để nghiên cứu thị trường chuyên sâu - trong một nền tảng duy nhất."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featureCards.map((card) => (
              <IconCardView key={card.title} {...card} />
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 py-20 md:grid-cols-[0.9fr_1.1fr] md:px-8">
          <div>
            <span className="inline-flex rounded-full bg-ml-blue-soft px-4 py-1.5 text-xs font-black uppercase text-ml-blue-strong">
              Xem thực tế
            </span>
            <h2 className="mt-5 text-3xl font-black leading-tight text-ml-ink md:text-[38px]">Dashboard nghiên cứu thông minh</h2>
            <p className="mt-5 text-base font-semibold leading-7 text-ml-ink-muted">
              Toàn bộ quy trình nghiên cứu - từ tạo persona, chạy focus group đến xem kết quả phân tích - được thiết kế để bất kỳ ai cũng
              có thể dùng được, không cần kỹ năng kỹ thuật.
            </p>
            <ul className="mt-7 space-y-4 text-sm font-black text-ml-ink">
              {['Giao diện kéo-thả trực quan', 'Kết quả tổng hợp tự động', 'Báo cáo sẵn sàng để trình bày'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="text-ml-blue" size={20} />
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={onStart}
              className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-lg bg-ml-blue px-6 text-sm font-black text-white transition-colors hover:bg-ml-blue-strong"
            >
              Xem demo trực tiếp
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="rounded-lg bg-ml-ink p-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-ml-danger" />
                <span className="h-3 w-3 rounded-full bg-ml-warning" />
                <span className="h-3 w-3 rounded-full bg-ml-success" />
              </div>
              <span className="text-xs font-black text-white/70">Market Lab - Research Dashboard v2.4</span>
            </div>
            <div className="grid grid-cols-1 gap-4 pt-5 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <h3 className="text-sm font-black text-white">Focus Group #3 - Phân tích thị trường nước uống</h3>
                <p className="mt-1 text-xs font-semibold text-white/50">6 persona · Đang hoạt động · Bắt đầu 14:32</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {dashboardPersonas.map(([initials, name, meta, color]) => (
                    <div key={name} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-black text-white ${color}`}>
                        {initials}
                      </span>
                      <span>
                        <span className="block text-xs font-black text-white">{name}</span>
                        <span className="block text-[11px] font-semibold text-white/50">{meta}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4 text-sm font-medium leading-6 text-white/70">
                  <strong className="text-ml-blue-soft">Lan Anh:</strong> Tôi uống nước này mỗi sáng, nhưng giá hơi cao so với mấy hãng
                  quen. Nếu có size nhỏ rẻ hơn thì tôi sẽ mua thường xuyên hơn.
                </div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="text-xs font-black uppercase text-white/50">Cảm xúc</div>
                {[
                  ['Tích cực', '73%', 'bg-ml-success'],
                  ['Trung lập', '20%', 'bg-ml-blue'],
                  ['Tiêu cực', '7%', 'bg-ml-danger'],
                ].map(([label, value, color]) => (
                  <div key={label} className="mt-4">
                    <div className="mb-1 flex justify-between text-xs font-black text-white/75">
                      <span>{label}</span>
                      <span>{value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-black/30">
                      <div className={`h-full rounded-full ${color}`} style={{ width: value }} />
                    </div>
                  </div>
                ))}
                <div className="mt-7 text-xs font-black uppercase text-white/50">Chủ đề</div>
                {[
                  ['Giá cả', '62%'],
                  ['Hương vị', '48%'],
                ].map(([label, value]) => (
                  <div key={label} className="mt-4">
                    <div className="mb-1 flex justify-between text-xs font-black text-white/75">
                      <span>{label}</span>
                      <span>{value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-black/30">
                      <div className="h-full rounded-full bg-ml-blue" style={{ width: value }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-ml-surface px-5 py-20 md:px-8" id="danhgia">
          <div className="mx-auto max-w-7xl">
            <SectionHeader title="Lợi ích cụ thể cho doanh nghiệp" body="Market Lab không chỉ nhanh hơn - mà còn thông minh hơn và tiết kiệm hơn." />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {benefits.map((benefit) => (
                <article key={benefit.value} className="text-center">
                  <div className="text-5xl font-black leading-none text-ml-blue">{benefit.value}</div>
                  <h3 className="mt-4 text-base font-black text-ml-ink">{benefit.title}</h3>
                  <p className="mx-auto mt-3 max-w-xs text-sm font-semibold leading-6 text-ml-ink-muted">{benefit.body}</p>
                </article>
              ))}
            </div>
            <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
              {testimonials.map((item) => (
                <article key={item.name} className="rounded-lg border border-ml-border bg-white p-6">
                  <p className="text-sm font-medium italic leading-7 text-ml-ink-muted">“{item.quote}”</p>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ml-blue text-sm font-black text-white">
                      {item.initials}
                    </span>
                    <span>
                      <span className="block text-sm font-black text-ml-ink">{item.name}</span>
                      <span className="block text-xs font-bold text-ml-ink-muted">{item.role}</span>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-ml-ink px-5 py-20 md:px-8" id="khoahoc">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <span className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-black uppercase text-ml-blue-soft">
                Khoa học
              </span>
              <h2 className="text-3xl font-black leading-tight text-white md:text-[38px]">Được xây dựng trên nền tảng khoa học</h2>
              <p className="mt-4 text-base font-semibold leading-7 text-white/60">
                Chúng tôi ám ảnh về sự tương đồng giữa dữ liệu tổng hợp và thực tế. Đây là cách chúng tôi đo lường độ chính xác và liên tục
                cải tiến mô hình.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {scienceCards.map((card) => (
                <article key={card.title} className="rounded-lg border border-white/10 bg-white/5 p-6">
                  <div className="text-3xl font-black leading-tight text-ml-blue-soft">{card.value}</div>
                  <h3 className="mt-3 text-base font-black text-white">{card.title}</h3>
                  <p className="mt-4 text-sm font-medium leading-7 text-white/60">{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8" id="faq">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[240px_1fr]">
            <aside className="md:sticky md:top-24 md:self-start">
              <h2 className="text-3xl font-black text-ml-ink">Câu hỏi thường gặp</h2>
              <div className="mt-6 flex flex-wrap gap-2 md:flex-col">
                {['Bắt đầu', 'Điểm khác biệt', 'AI Persona & Mô phỏng', 'Khảo sát người thật', 'Không cần code', 'Giá & Gói cước'].map(
                  (item, index) => (
                    <a
                      key={item}
                      href="#faq"
                      className={`rounded-lg px-4 py-2 text-sm font-black ${
                        index === 0 ? 'bg-ml-blue-soft text-ml-blue-strong' : 'text-ml-ink-muted hover:bg-ml-surface'
                      }`}
                    >
                      {item}
                    </a>
                  ),
                )}
              </div>
            </aside>
            <div className="divide-y divide-ml-border">
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-2">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-base font-black text-ml-ink">
                    {faq.question}
                    <Plus className="shrink-0 text-ml-blue transition-transform group-open:rotate-45" size={22} />
                  </summary>
                  <p className="pb-6 text-sm font-medium leading-7 text-ml-ink-muted">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-ml-ink px-5 py-20 text-center md:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-black text-white">Nhận cập nhật mới nhất từ Market Lab</h2>
            <p className="mx-auto mt-4 max-w-xl text-base font-semibold leading-7 text-white/60">
              Công cụ mới, nghiên cứu khoa học và case study thực tế từ cộng đồng người dùng Market Lab.
            </p>
            <form className="mt-7 flex flex-col justify-center gap-3 sm:flex-row" onSubmit={(event) => event.preventDefault()}>
              <label className="sr-only" htmlFor="landing-email">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  id="landing-email"
                  type="email"
                  placeholder="Email của bạn"
                  className="h-12 w-full rounded-lg border border-white/10 bg-white/5 pl-11 pr-4 text-sm font-semibold text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-ml-blue sm:w-80"
                />
              </div>
              <button type="submit" className="h-12 rounded-lg bg-ml-blue px-6 text-sm font-black text-white hover:bg-ml-blue-strong">
                Đăng ký ngay
              </button>
            </form>
            <p className="mt-4 text-xs font-semibold text-white/40">Không spam. Hủy đăng ký bất cứ lúc nào.</p>
          </div>
        </section>
      </main>

      <footer className="bg-[#101820] px-5 py-14 text-white/60 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
            <div>
              <a href="#/landing" className="inline-flex items-center gap-3 text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ml-blue text-white">
                  <FlaskConical size={22} />
                </span>
                <span className="text-xl font-black">Market Lab</span>
              </a>
              <p className="mt-4 max-w-xs text-sm font-semibold leading-7 text-white/50">
                Nghiên cứu thị trường thế hệ AI. Nhanh hơn, thông minh hơn, tiết kiệm hơn.
              </p>
            </div>
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h4 className="text-xs font-black uppercase text-white">{group.title}</h4>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a href="#/landing" className="text-sm font-semibold text-white/55 hover:text-ml-blue-soft">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs font-semibold text-white/40 md:flex-row md:items-center md:justify-between">
            <span>© 2026 Market Lab. Bảo lưu mọi quyền.</span>
            <span className="flex gap-5">
              <a href="#/landing" className="hover:text-white/70">
                Chính sách bảo mật
              </a>
              <a href="#/landing" className="hover:text-white/70">
                Điều khoản sử dụng
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
