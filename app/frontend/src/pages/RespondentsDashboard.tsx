import React, { useEffect, useState } from 'react';
import type { Persona, Respondent } from '../types';
import { getProjectPersonas, getProjectRespondents, generateRespondents } from '../api/client';
import { Users, RefreshCw, SlidersHorizontal, ShieldAlert, Sparkles, Database, ChevronDown } from 'lucide-react';

interface RespondentsDashboardProps {
  projectId: string;
}

export const RespondentsDashboard: React.FC<RespondentsDashboardProps> = ({ projectId }) => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [panelSize, setPanelSize] = useState<number>(10);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');

  // Load personas and respondents
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [personasData, respondentsData] = await Promise.all([
        getProjectPersonas(projectId),
        getProjectRespondents(projectId),
      ]);
      setPersonas(personasData);
      setRespondents(respondentsData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Không thể tải dữ liệu người tham gia mô phỏng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  // Handle generation
  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const result = await generateRespondents(projectId, panelSize);
      setRespondents(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Không thể tạo nhóm người tham gia mô phỏng.');
    } finally {
      setGenerating(false);
    }
  };

  // Helper: map persona_id to Persona name
  const getPersonaName = (personaId: string) => {
    const p = personas.find((item) => item.id === personaId);
    return p ? p.name : 'Chân dung không xác định';
  };

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

  // Filtered respondents
  const filteredRespondents = respondents.filter((r) => {
    if (selectedPersonaId !== 'all' && r.persona_id !== selectedPersonaId) return false;
    if (selectedBudget !== 'all' && r.budget !== selectedBudget) return false;
    if (selectedTech !== 'all' && r.tech_savviness !== selectedTech) return false;
    if (selectedRisk !== 'all' && r.risk_attitude !== selectedRisk) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 animate-pulse space-y-8">
        <div className="h-10 bg-ml-border rounded-lg w-1/3"></div>
        <div className="h-32 bg-ml-border rounded-lg"></div>
        <div className="h-64 bg-ml-border rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8 text-ml-ink">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ml-border pb-5">
        <div>
          <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-ml-blue bg-ml-blue-soft border border-ml-blue/20 rounded-full uppercase mb-2">
            Bảng mô phỏng
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase flex items-center gap-2">
            <Users className="text-ml-blue" size={28} />
            Người tham gia mô phỏng
          </h1>
          <p className="text-sm text-ml-ink-muted font-medium mt-1">
            Tạo và xem danh sách người tham gia ảo được ánh xạ từ các chân dung khách hàng.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={generating}
          className="self-start md:self-center flex items-center gap-1.5 px-3 py-1.5 border border-ml-border bg-white hover:bg-ml-surface hover:text-ml-ink text-ml-ink-muted text-xs font-bold rounded-lg transition-colors duration-150 shadow-2xs cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={12} className={generating ? 'animate-spin' : ''} />
          TẢI LẠI
        </button>
      </div>

      {/* Warning Notice Banner */}
      <div className="rounded-lg border border-ml-warning/30 bg-amber-50/50 p-5 flex items-start gap-4 shadow-2xs">
        <div className="p-2 rounded-md bg-amber-100 text-ml-warning mt-0.5 border border-ml-warning/20">
          <ShieldAlert size={20} />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-ml-warning uppercase tracking-wider">Cảnh báo dữ liệu mô phỏng</h3>
          <p className="text-xs text-ml-ink-muted leading-relaxed font-medium">
            Bảng này hiển thị các hồ sơ người tham gia mô phỏng do AI tạo từ chân dung khách hàng gốc. Mọi hành vi, nhân khẩu học, kênh ưa thích và phản đối chỉ là giả định mô phỏng. Bạn <strong>BẮT BUỘC</strong> phải kiểm chứng bằng nghiên cứu với người thật trước khi ra quyết định kinh doanh hoặc sản phẩm.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-ml-danger/10 border border-ml-danger/30 rounded-lg text-sm font-bold text-ml-danger">
          Lỗi: {error}
        </div>
      )}

      {/* Generation Widget & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel Generator Action Widget */}
        <div className="lg:col-span-1 rounded-lg border border-ml-border bg-white p-6 space-y-6 shadow-2xs">
          <h2 className="text-base font-bold text-ml-ink border-b border-ml-border pb-3 flex items-center gap-2">
            <Sparkles className="text-ml-blue" size={18} />
            Tạo nhóm người tham gia
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="panel-size" className="block text-[11px] font-bold text-ml-ink-muted uppercase tracking-wider">
                Số người mỗi chân dung
              </label>
              <div className="relative">
                <select
                  id="panel-size"
                  value={panelSize}
                  onChange={(e) => setPanelSize(Number(e.target.value))}
                  disabled={generating}
                  className="w-full bg-ml-surface border border-ml-border rounded-lg px-3 py-2.5 text-sm font-semibold appearance-none focus:outline-none focus:border-ml-blue cursor-pointer"
                >
                  <option value={5}>5 người (tổng 15)</option>
                  <option value={10}>10 người (tổng 30 - mặc định)</option>
                  <option value={20}>20 người (tổng 60)</option>
                  <option value={30}>30 người (tổng 90)</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-ml-ink-muted pointer-events-none" size={14} />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-ml-blue hover:bg-ml-blue-strong disabled:bg-ml-blue/60 text-white font-bold rounded-lg transition-colors duration-150 shadow-xs cursor-pointer disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  Đang mô phỏng...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Tạo nhóm mô phỏng
                </>
              )}
            </button>

            <p className="text-[11px] text-ml-ink-muted font-medium leading-normal text-center bg-ml-surface py-2 px-3 rounded border border-ml-border/30">
              Lưu ý: Tạo lại sẽ ghi đè toàn bộ người tham gia hiện có của dự án trong cơ sở dữ liệu cục bộ.
            </p>
          </div>
        </div>

        {/* Current Panel Status / Persona Stats */}
        <div className="lg:col-span-2 rounded-lg border border-ml-border bg-white p-6 space-y-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-ml-ink border-b border-ml-border pb-3 flex items-center gap-2">
              <Database className="text-ml-blue" size={18} />
              Phân bổ nhóm người tham gia
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {personas.map((persona) => {
                const count = respondents.filter((r) => r.persona_id === persona.id).length;
                return (
                  <div key={persona.id} className="p-4 border border-ml-border rounded-lg bg-ml-surface/40 hover:bg-ml-surface/75 transition-colors duration-100 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-ml-blue uppercase tracking-wider mb-1">{persona.segment}</div>
                      <div className="text-base font-black text-ml-ink">{persona.name}</div>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                      <span className="text-[10px] text-ml-ink-muted font-bold uppercase tracking-wider">Số người</span>
                      <span className="text-2xl font-black text-ml-blue">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-ml-border/50 pt-4 flex items-center justify-between mt-6">
            <span className="text-xs font-bold text-ml-ink-muted uppercase tracking-wider">Quy mô hiện tại</span>
            <span className="text-xl font-black text-ml-ink">{respondents.length} người</span>
          </div>
        </div>
      </div>

      {/* Filter and Table View */}
      <div className="rounded-lg border border-ml-border bg-white shadow-2xs overflow-hidden">
        {/* Filters Header */}
        <div className="p-5 border-b border-ml-border bg-ml-surface/20 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-ml-ink uppercase tracking-wider">
            <SlidersHorizontal size={16} className="text-ml-blue" />
            Lọc người tham gia
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Persona filter */}
            <div className="space-y-1.5">
              <label htmlFor="filter-persona" className="block text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider">Chân dung gốc</label>
              <select
                id="filter-persona"
                value={selectedPersonaId}
                onChange={(e) => setSelectedPersonaId(e.target.value)}
                className="w-full bg-white border border-ml-border rounded-md px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-ml-blue cursor-pointer"
              >
                <option value="all">Tất cả chân dung</option>
                {personas.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.segment})</option>
                ))}
              </select>
            </div>

            {/* Budget filter */}
            <div className="space-y-1.5">
              <label htmlFor="filter-budget" className="block text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider">Mức ngân sách</label>
              <select
                id="filter-budget"
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="w-full bg-white border border-ml-border rounded-md px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-ml-blue cursor-pointer"
              >
                <option value="all">Tất cả</option>
                <option value="Low">Thấp</option>
                <option value="Medium">Trung bình</option>
                <option value="High">Cao</option>
              </select>
            </div>

            {/* Tech filter */}
            <div className="space-y-1.5">
              <label htmlFor="filter-tech" className="block text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider">Mức am hiểu công nghệ</label>
              <select
                id="filter-tech"
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="w-full bg-white border border-ml-border rounded-md px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-ml-blue cursor-pointer"
              >
                <option value="all">Tất cả</option>
                <option value="Low">Thấp</option>
                <option value="Medium">Trung bình</option>
                <option value="High">Cao</option>
              </select>
            </div>

            {/* Risk filter */}
            <div className="space-y-1.5">
              <label htmlFor="filter-risk" className="block text-[10px] font-bold text-ml-ink-muted uppercase tracking-wider">Thái độ rủi ro</label>
              <select
                id="filter-risk"
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
                className="w-full bg-white border border-ml-border rounded-md px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-ml-blue cursor-pointer"
              >
                <option value="all">Tất cả</option>
                <option value="Risk-averse">Ngại rủi ro</option>
                <option value="Neutral">Trung lập</option>
                <option value="Risk-seeking">Ưa rủi ro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          {filteredRespondents.length === 0 ? (
            <div className="p-8 text-center text-sm font-semibold text-ml-ink-muted">
              Không có người tham gia phù hợp với bộ lọc hiện tại hoặc chưa có nhóm mô phỏng nào được tạo.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ml-surface border-b border-ml-border text-[10px] text-ml-ink-muted font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Tên</th>
                  <th className="py-3 px-4">Chân dung gốc</th>
                  <th className="py-3 px-2">Tuổi</th>
                  <th className="py-3 px-4">Khu vực</th>
                  <th className="py-3 px-2 text-center">Ngân sách</th>
                  <th className="py-3 px-2 text-center">Công nghệ</th>
                  <th className="py-3 px-2 text-center">Rủi ro</th>
                  <th className="py-3 px-4">Kênh</th>
                  <th className="py-3 px-4">Động lực</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ml-border/60 text-xs">
                {filteredRespondents.map((item) => (
                  <tr key={item.id} className="hover:bg-ml-surface/40 transition-colors duration-75">
                    <td className="py-3.5 px-4 font-bold text-ml-ink">{item.name}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold">{getPersonaName(item.persona_id)}</div>
                      <div className="text-[10px] text-ml-ink-muted mt-0.5 uppercase tracking-wider">{personas.find(p => p.id === item.persona_id)?.segment}</div>
                    </td>
                    <td className="py-3.5 px-2 font-medium">{item.age}</td>
                    <td className="py-3.5 px-4 text-ml-ink-muted">{item.location}</td>
                    <td className="py-3.5 px-2 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded font-semibold text-[10px] ${
                        item.budget === 'High' ? 'bg-emerald-100 text-emerald-800' :
                        item.budget === 'Medium' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {budgetLabel(item.budget)}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded font-semibold text-[10px] ${
                        item.tech_savviness === 'High' ? 'bg-emerald-100 text-emerald-800' :
                        item.tech_savviness === 'Medium' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {techLabel(item.tech_savviness)}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded font-semibold text-[10px] ${
                        item.risk_attitude === 'Risk-seeking' ? 'bg-amber-100 text-amber-800' :
                        item.risk_attitude === 'Neutral' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {riskLabel(item.risk_attitude)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-ml-ink-muted">{item.channel}</td>
                    <td className="py-3.5 px-4 max-w-xs text-ml-ink-muted leading-relaxed font-medium">
                      <p>{item.motivation}</p>
                      {item.decision_rules && item.decision_rules.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.decision_rules.map((rule, idx) => (
                            <span key={idx} className="bg-ml-surface px-1.5 py-0.5 rounded text-[9px] text-ml-ink font-semibold border border-ml-border/40">
                              {rule}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
