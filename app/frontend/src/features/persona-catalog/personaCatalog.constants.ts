import {
  BriefcaseBusiness,
  Compass,
  Search,
  Zap,
} from 'lucide-react';
import type {
  PersonaCreationOption,
  PersonaTabOption,
} from './personaCatalog.types';

export const EXAMPLE_PROMPTS = [
  'Sinh viên năm cuối tại Việt Nam đang luyện IELTS Speaking với ngân sách hàng tháng hạn chế.',
  'Nhân sự trẻ đang so sánh các công cụ AI tăng năng suất cho một đội marketing nhỏ.',
  'Người mua mỹ phẩm Gen Z quan tâm tới routine chăm sóc da đơn giản, giá hợp lý và dễ duy trì.',
];

export const personaTabs: PersonaTabOption[] = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'research', label: 'Persona nghiên cứu' },
  { id: 'buyer', label: 'Persona người mua' },
  { id: 'hybrid', label: 'Persona kết hợp' },
  { id: 'competitor', label: 'Persona đối thủ', note: 'Sắp ra mắt' },
];

export const personaCreationOptions: PersonaCreationOption[] = [
  {
    id: 'research',
    eyebrow: '1. Persona nghiên cứu',
    title: 'Persona từ dữ liệu thị trường bên ngoài',
    subtitle: 'Tạo từ khảo sát, phỏng vấn, báo cáo, social listening và tín hiệu công khai.',
    description:
      'Dùng khi dữ liệu nội bộ còn ít và bạn cần hiểu đối tượng tiềm năng, nỗi đau, xu hướng, động lực và các điểm bám thông điệp.',
    badgeClass: 'bg-ml-blue text-white',
    iconClass: 'bg-ml-blue-soft text-ml-blue',
    icon: Search,
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
    icon: BriefcaseBusiness,
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
    icon: Zap,
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
    icon: Compass,
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
      note:
        'Tùy chọn: phù hợp như lớp tham khảo bổ sung, không phải mô-đun trung tâm của luồng tạo persona.',
    },
  },
];

export const processingSteps = [
  'Đang ánh xạ bối cảnh đối tượng',
  'Đang cấu trúc tín hiệu hành vi',
  'Đang chấm điểm mức độ phù hợp kênh',
  'Đang chuẩn bị persona chỉ đọc',
];
