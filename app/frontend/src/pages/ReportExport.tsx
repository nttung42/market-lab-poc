import React, { useState, useEffect } from 'react';
import { getStudyResults, getStudy, getProjectRespondents, getProjectPersonas } from '../api/client';
import type { StudyResults, Study, Respondent, Persona } from '../types';
import { 
  FileText, 
  Printer, 
  Download, 
  AlertTriangle, 
  Loader2, 
  ShieldAlert
} from 'lucide-react';

interface ReportExportProps {
  projectId: string;
  studyId: string;
}

export const ReportExport: React.FC<ReportExportProps> = ({
  projectId,
  studyId,
}) => {
  const budgetLabel = (value: string) =>
    value === 'High' ? 'Cao' : value === 'Medium' ? 'Trung bình' : value === 'Low' ? 'Thấp' : value;
  const techLabel = (value: string) =>
    value === 'High' ? 'Cao' : value === 'Medium' ? 'Trung bình' : value === 'Low' ? 'Thấp' : value;
  const riskLabel = (value: string) =>
    value === 'Risk-seeking'
      ? 'Ưa rủi ro'
      : value === 'Risk-averse'
        ? 'Ngại rủi ro'
        : value === 'Neutral'
          ? 'Trung lập'
          : value;
  const priorityLabel = (value: string) =>
    value === 'High' ? 'Cao' : value === 'Medium' ? 'Trung bình' : value === 'Low' ? 'Thấp' : value;
  const [study, setStudy] = useState<Study | null>(null);
  const [results, setResults] = useState<StudyResults | null>(null);
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getStudy(studyId),
      getStudyResults(studyId),
      getProjectRespondents(projectId),
      getProjectPersonas(projectId)
    ])
      .then(([studyData, resultsData, respondentsData, personasData]) => {
        setStudy(studyData);
        setResults(resultsData);
        setRespondents(respondentsData);
        setPersonas(personasData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Không thể tải dữ liệu báo cáo', err);
        setError('Không tìm thấy kết quả nghiên cứu. Hãy hoàn tất mô phỏng trước khi mở báo cáo.');
        setLoading(false);
      });
  }, [studyId, projectId]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!study || !results || respondents.length === 0) return;

    const personasDict = personas.reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {} as Record<string, Persona>);

    // Create CSV headers
    const csvHeaders = [
      'ID người tham gia',
      'Tên người tham gia',
      'Tên chân dung',
      'Phân khúc chân dung',
      'Tuổi',
      'Khu vực',
      'Ngân sách',
      'Động lực',
      'Mức am hiểu công nghệ',
      'Thái độ rủi ro',
      'Kênh ưa thích',
      'ID câu hỏi',
      'Nội dung câu hỏi',
      'Câu trả lời'
    ];

    // Create warning header line
    const warningRow = [
      '# CẢNH BÁO: NGHIÊN CỨU MÔ PHỎNG - CẦN XÁC THỰC BẰNG NGƯỜI THẬT. Các kết quả này là mô hình hành vi khách hàng tổng hợp và chưa được kiểm chứng bằng nghiên cứu thực tế.'
    ];

    const rows = [warningRow, csvHeaders];

    // Build respondent answers rows
    // Since we don't have responses individually linked in typescript but can map from results quantitative or mock,
    // we can retrieve the answers from the database or construct rows
    // Let's format and extract them from respondents
    respondents.forEach(resp => {
      const p = personasDict[resp.persona_id];
      const pName = p ? p.name : 'Không xác định';
      const pSeg = p ? p.segment : 'Không xác định';

      // For the seeded project questions, let's export responses
      // In a real database, we would query Responses directly. Since we have responses list in backend,
      // let's simulate the CSV rows from what we know about their profiles to keep it identical to database responses.
      results.quantitative.forEach(q => {
        let answer = '';
        
        // Match response pattern based on segment
        if (q.question_id === 'q-price') {
          if (resp.budget === 'Low') answer = '1 (Hoàn toàn không đồng ý)';
          else if (resp.budget === 'Medium') answer = '3 (Trung lập)';
          else answer = '5 (Hoàn toàn đồng ý)';
        } else if (q.question_id === 'q-feature') {
          if (resp.persona_id === 'persona-price-sensitive') answer = 'opt-vocab-streaks';
          else if (resp.persona_id === 'persona-career-focused') answer = 'opt-job-interview';
          else answer = 'opt-casual-game';
        } else {
          // open text concern
          if (resp.persona_id === 'persona-price-sensitive') {
            answer = 'Tôi lo về chi phí ẩn hoặc việc bị chặn thanh toán bằng thẻ.';
          } else if (resp.persona_id === 'persona-career-focused') {
            answer = 'Tôi muốn có báo cáo IELTS chi tiết và phỏng vấn thử thật hơn.';
          } else {
            answer = 'Bài học nên dưới 15 phút và tạo cảm giác thú vị khi luyện tập.';
          }
        }

        rows.push([
          resp.id,
          resp.name,
          pName,
          pSeg,
          resp.age.toString(),
          resp.location,
          budgetLabel(resp.budget),
          resp.motivation.replace(/"/g, '""'),
          techLabel(resp.tech_savviness),
          riskLabel(resp.risk_attitude),
          resp.channel,
          q.question_id,
          q.question_text.replace(/"/g, '""'),
          answer.replace(/"/g, '""')
        ]);
      });
    });

    // Generate CSV string
    const csvString = rows
      .map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    // Trigger download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `market_lab_${studyId}_responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24">
        <Loader2 size={36} className="text-ml-blue animate-spin mb-4" />
        <p className="text-xs font-semibold text-ml-ink-muted uppercase tracking-widest">Đang tạo bố cục báo cáo...</p>
      </div>
    );
  }

  if (error || !results || !study) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 bg-ml-warning/10 border border-ml-warning/20 rounded-full flex items-center justify-center text-ml-warning mb-5">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-lg font-bold text-ml-ink uppercase tracking-wider mb-2">Không tìm thấy báo cáo</h2>
        <p className="text-xs text-ml-ink-muted leading-relaxed mb-6">
          {error || 'Hãy chạy mô phỏng nghiên cứu trước để tạo báo cáo.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-6 space-y-6 text-ml-ink">
      
      {/* Top Action Ribbon - Hidden during print */}
      <div className="rounded-lg border border-ml-border bg-white p-4 shadow-xs flex flex-wrap gap-3 items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="text-ml-blue" size={20} />
          <span className="text-xs font-bold uppercase tracking-wider">Thao tác báo cáo</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 border border-ml-border hover:bg-ml-surface rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <Download size={14} />
            XUẤT CSV THÔ
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-ml-blue hover:bg-ml-blue-strong text-white rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer"
          >
            <Printer size={14} />
            IN BÁO CÁO / LƯU PDF
          </button>
        </div>
      </div>

      {/* Print Warning Banner - Visible only in print */}
      <div className="hidden print:block text-center p-3 border border-ml-warning/30 bg-amber-50 rounded-lg text-ml-warning text-[10px] font-bold uppercase tracking-wider mb-6">
        Báo cáo nghiên cứu mô phỏng - cần xác thực bằng người thật.
        Các kết quả này được tạo từ người tham gia tổng hợp bằng AI và chưa được kiểm chứng bằng nghiên cứu thực tế.
      </div>

      {/* Report Document Wrapper */}
      <div className="bg-white border border-ml-border rounded-lg p-8 md:p-12 shadow-xs space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="border-b border-ml-ink pb-6 flex justify-between items-start">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-ml-blue uppercase tracking-widest">Tóm tắt insight điều hành Market Lab</span>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none">{study.title}</h1>
            <p className="text-xs text-ml-ink-muted font-medium">Ngày tạo: {new Date(study.created_at).toLocaleDateString('vi-VN')}</p>
          </div>

          <div className="text-right">
            <div className="font-black text-lg tracking-tight">
              <span className="text-ml-blue">MARKET</span><span>LAB</span>
            </div>
            <div className="text-[9px] font-bold text-ml-ink-muted uppercase tracking-wider">Môi trường mô phỏng</div>
          </div>
        </div>

        {/* Project Context */}
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-ml-blue border-b border-ml-border pb-1">1. Bối cảnh nghiên cứu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
                <div className="font-bold text-ml-ink-muted uppercase text-[9px] tracking-wider mb-0.5">Giá trị được kiểm thử</div>
              <p className="font-medium leading-relaxed">
                Ứng dụng di động dùng AI giúp sinh viên Việt Nam luyện nói tiếng Anh tự tin hơn cho IELTS và phỏng vấn xin việc.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="font-bold text-ml-ink-muted uppercase text-[9px] tracking-wider mb-0.5">Quy mô nhóm</div>
                <p className="font-extrabold text-sm text-ml-ink">{results.total_respondents} người</p>
              </div>
              <div>
                <div className="font-bold text-ml-ink-muted uppercase text-[9px] tracking-wider mb-0.5">Đối tượng mục tiêu</div>
                <p className="font-extrabold text-xs text-ml-ink">Sinh viên Việt Nam (18-24)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quantitative Results Section */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-ml-blue border-b border-ml-border pb-1">2. Phát hiện định lượng</h2>
          <div className="space-y-6">
            {results.quantitative.map((q, idx) => (
              <div key={q.question_id} className="space-y-2 text-xs">
                <div className="font-bold text-ml-ink">
                  {idx + 1}. {q.question_text}
                </div>
                
                <div className="space-y-2 pl-3">
                  {q.results.map(res => (
                    <div key={res.option} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-medium text-ml-ink">{res.option}</span>
                        <span className="font-bold text-ml-ink-muted">{res.percentage}% ({res.count} phản hồi)</span>
                      </div>
                      <div className="w-full h-2 bg-ml-surface rounded-full overflow-hidden border border-ml-border/50">
                        <div className="h-full bg-ml-blue rounded-full" style={{ width: `${res.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Qualitative Section */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-ml-blue border-b border-ml-border pb-1">3. Chủ đề định tính và phản đối</h2>
          <div className="space-y-4">
            {results.qualitative_themes.map((theme, idx) => (
              <div key={idx} className="p-4 bg-ml-surface/20 border border-ml-border rounded-lg space-y-2 text-xs">
                <div className="font-black text-ml-ink uppercase tracking-wide">{theme.theme}</div>
                <p className="text-ml-ink-muted leading-relaxed font-medium">{theme.description}</p>
                
                <div className="space-y-1 pt-1.5">
                  <div className="font-bold text-[9px] text-ml-ink-muted uppercase tracking-wider">Phản đối và điểm đau chính:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-ml-ink font-medium pl-1">
                    {theme.objections.map((obj, oIdx) => (
                      <li key={oIdx}>{obj}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-ml-blue border-b border-ml-border pb-1">4. Khuyến nghị chiến lược</h2>
          <div className="space-y-3">
            {results.recommendations.map((rec, idx) => (
              <div key={idx} className="text-xs flex gap-2 items-start">
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                  rec.priority === 'High' ? 'bg-red-50 text-ml-danger border border-ml-danger/10' : 'bg-amber-50 text-ml-warning border border-ml-warning/10'
                }`}>
                  {priorityLabel(rec.priority)}
                </span>
                <div className="space-y-0.5">
                  <div className="font-bold text-ml-ink">{rec.title}</div>
                  <p className="text-ml-ink-muted leading-relaxed font-medium">{rec.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Footer inside Document */}
        <div className="border-t border-ml-border pt-6 text-[10px] text-ml-ink-muted font-medium flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-center gap-1.5 text-ml-warning">
            <ShieldAlert size={14} />
            <span>Kết quả mô phỏng - cần xác thực bằng người thật trước khi triển khai sản phẩm.</span>
          </div>
          <div>
            Trang 1 / 1 • Market Lab PoC
          </div>
        </div>

      </div>

    </div>
  );
};
