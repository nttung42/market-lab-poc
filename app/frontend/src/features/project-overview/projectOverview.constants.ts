import { defaultProjectFormValues } from './projectOverview.utils';
import type { WorkspaceSuggestion } from './projectOverview.types';

export const workspaceSuggestions: WorkspaceSuggestion[] = [
  {
    label: 'Huấn luyện tiếng Anh AI',
    name: 'Trợ lý luyện tiếng Anh công việc bằng AI',
    product_description:
      'Một trợ lý nói tiếng Anh bằng AI giúp người đi làm giai đoạn đầu luyện tiếng Anh công việc, chuẩn bị họp và nhận phản hồi về độ rõ ràng cũng như sự tự tin.',
    industry: 'EdTech, SaaS',
    market: 'Vietnam, Southeast Asia',
    target_audience: 'Sinh viên đại học, nhân sự mới đi làm',
    research_objective:
      'Chọn thông điệp mạnh hơn giữa xây dựng sự tự tin và tính tiện lợi.',
    study_type: defaultProjectFormValues.study_type,
  },
  {
    label: 'Dashboard bán hàng SME',
    name: 'Dashboard doanh số social commerce',
    product_description:
      'Không gian phân tích gọn nhẹ giúp người bán online quy mô nhỏ theo dõi đơn hàng, chiến dịch và khách mua lại trên các kênh social commerce.',
    industry: 'RetailTech, SaaS',
    market: 'Vietnam',
    target_audience: 'Chủ SME, người vận hành social commerce',
    research_objective:
      'Xác định định vị nào thu hút hơn: nhìn rõ tăng trưởng hay tiết kiệm thời gian vận hành.',
    study_type: defaultProjectFormValues.study_type,
  },
  {
    label: 'Ứng dụng skincare',
    name: 'Ứng dụng gợi ý routine skincare cá nhân hóa',
    product_description:
      'Ứng dụng di động gợi ý quy trình chăm sóc da đơn giản dựa trên vấn đề da, ngân sách và lối sống, đồng thời nhắc người dùng duy trì đều đặn.',
    industry: 'Consumer Health, Mobile App',
    market: 'Urban Vietnam',
    target_audience: 'Người mua mỹ phẩm Gen Z và Millennials',
    research_objective:
      'Kiểm thử xem thông điệp nhấn mạnh niềm tin hay sự tiện lợi phù hợp hơn.',
    study_type: defaultProjectFormValues.study_type,
  },
];
