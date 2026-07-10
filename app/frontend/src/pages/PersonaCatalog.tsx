import { Compass, ShoppingBag, Tags } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { generatePersona, getProjectPersonas } from '../api/client';
import { PersonaMockPanel } from '../features/persona-catalog/PersonaMockPanel';
import { PersonaOverview } from '../features/persona-catalog/PersonaOverview';
import { PersonaResearchWorkspace } from '../features/persona-catalog/PersonaResearchWorkspace';
import { PersonaSubNav } from '../features/persona-catalog/PersonaSubNav';
import { EXAMPLE_PROMPTS } from '../features/persona-catalog/personaCatalog.constants';
import type { PersonaTab } from '../features/persona-catalog/personaCatalog.types';
import type { Persona } from '../types';

interface PersonaCatalogProps {
  projectId: string;
}

export const PersonaCatalog = ({ projectId }: PersonaCatalogProps) => {
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
      } catch (nextError) {
        if (!cancelled) {
          const message =
            nextError instanceof Error
              ? nextError.message
              : 'Không thể tải danh sách persona.';
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

  const handleGenerate = async (event: React.FormEvent<HTMLFormElement>) => {
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
    } catch (nextError) {
      const message =
        nextError instanceof Error ? nextError.message : 'Không thể tạo persona.';
      setError(message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="mx-auto flex-1 w-full max-w-7xl space-y-6 px-6 py-6 text-ml-ink">
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
        <PersonaResearchWorkspace
          prompt={prompt}
          loading={loading}
          generating={generating}
          error={error}
          personas={personas}
          selectedPersona={selectedPersona}
          onPromptChange={setPrompt}
          onSubmit={handleGenerate}
          onSelectPersona={setSelectedPersonaId}
        />
      )}
    </div>
  );
};
