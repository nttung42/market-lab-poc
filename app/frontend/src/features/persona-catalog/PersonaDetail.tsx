import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  FileText,
  Globe2,
  HeartPulse,
  Lock,
  Megaphone,
  MessageCircle,
  Quote,
  ShieldAlert,
  ShoppingBag,
  Tags,
  User,
} from 'lucide-react';
import type { Persona } from '../../types';
import {
  BulletList,
  Chips,
  IndustrySignals,
  KeyValueGrid,
  Section,
  SignalBars,
} from './PersonaCatalogPrimitives';
import {
  clampWeight,
  fallbackSignals,
  getDemographicValue,
  splitDemographic,
} from './personaCatalog.utils';

interface PersonaDetailProps {
  persona: Persona;
}

export const PersonaDetail = ({ persona }: PersonaDetailProps) => {
  const profile = persona.insight_profile;
  const age = getDemographicValue(persona, 'Age');
  const location = getDemographicValue(persona, 'Location');
  const occupation =
    getDemographicValue(persona, 'Occupation') ||
    profile?.work_lifestyle?.occupation;
  const communication = profile?.communication || fallbackSignals(persona.channels, 92);
  const validation = persona.validation;

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-lg border border-ml-border bg-white">
        <div className="bg-ml-ink p-6 text-white md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-ml-blue">
                <User size={32} />
              </div>
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-md bg-ml-blue px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                    Persona mô phỏng
                  </span>
                  <span className="flex items-center gap-1 rounded-md border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                    <Lock size={11} />
                    Chỉ đọc
                  </span>
                  <span className="rounded-md border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                    Cần xác thực bởi người thật
                  </span>
                </div>
                <h1 className="text-3xl font-black uppercase leading-tight tracking-normal md:text-4xl">
                  {persona.name}
                </h1>
                <p className="mt-2 text-sm font-semibold text-white/80 md:text-base">
                  {persona.segment}
                  {age ? ` / ${age}` : ''}
                  {location ? ` / ${location}` : ''}
                </p>
              </div>
            </div>
            <div className="w-full rounded-lg border border-white/20 bg-white/10 p-4 lg:w-52">
              <div className="text-[10px] font-black uppercase tracking-wide text-white/70">
                Độ tin cậy
              </div>
              <div className="mt-1 text-3xl font-black text-white">
                {Math.round(persona.confidence_score)}%
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full bg-ml-blue"
                  style={{ width: `${clampWeight(persona.confidence_score)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 p-6 md:p-7 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex gap-3">
            <Quote size={22} className="mt-1 shrink-0 text-ml-blue" />
            <p className="text-lg font-semibold leading-relaxed text-ml-ink md:text-xl">
              "{persona.quote}"
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {persona.demographics.slice(0, 6).map((item) => {
              const parsed = splitDemographic(item);
              return (
                <div
                  key={item}
                  className="rounded-md border border-ml-border bg-ml-surface/50 p-3"
                >
                  <div className="text-[10px] font-black uppercase tracking-wide text-ml-ink-muted">
                    {parsed.label}
                  </div>
                  <div className="mt-0.5 text-sm font-bold text-ml-ink">
                    {parsed.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Section title="Thông tin hồ sơ" icon={<FileText size={17} />}>
          <div className="space-y-4">
            <div>
              <h3 className="mb-1 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
                Tóm tắt
              </h3>
              <p className="text-sm font-medium leading-relaxed text-ml-ink">
                {profile?.profile_information?.summary ||
                  persona.assumptions[0] ||
                  'Chưa có tóm tắt hồ sơ mô phỏng.'}
              </p>
            </div>
            <div>
              <h3 className="mb-1 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
                Khát vọng cá nhân
              </h3>
              <p className="text-sm font-medium leading-relaxed text-ml-ink">
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
              {
                label: 'Thu nhập',
                value:
                  profile?.work_lifestyle?.income ||
                  getDemographicValue(persona, 'Income'),
              },
              { label: 'Tình trạng', value: profile?.work_lifestyle?.marital_status },
              { label: 'Nhà ở', value: profile?.work_lifestyle?.housing_status },
              { label: 'Khu vực', value: location },
            ]}
          />
        </Section>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Section title="Hành vi mua hàng" icon={<ShoppingBag size={17} />}>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
                Yếu tố quyết định
              </h3>
              <BulletList
                items={
                  profile?.buying_behavior?.purchase_decision_factors ||
                  persona.buying_behavior
                }
              />
            </div>
            <div>
              <h3 className="mb-2 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
                Tác nhân kích hoạt
              </h3>
              <BulletList
                items={profile?.buying_behavior?.triggers || persona.decision_rules}
                tone="green"
              />
            </div>
          </div>
        </Section>

        <Section title="Động lực tâm lý" icon={<HeartPulse size={17} />}>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
                Mục tiêu
              </h3>
              <BulletList
                items={profile?.psychological_drivers?.goals || persona.goals}
                tone="green"
              />
            </div>
            <div>
              <h3 className="mb-2 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
                Nhu cầu chính
              </h3>
              <BulletList
                items={
                  profile?.psychological_drivers?.key_needs ||
                  persona.product_fit?.must_haves
                }
              />
            </div>
          </div>
        </Section>

        <Section title="Rào cản chính" icon={<ShieldAlert size={17} />}>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
                Thách thức cốt lõi
              </h3>
              <BulletList
                items={profile?.key_obstacles?.core_challenges || persona.pain_points}
                tone="red"
              />
            </div>
            <div>
              <h3 className="mb-2 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
                Rào cản cảm nhận
              </h3>
              <BulletList
                items={profile?.key_obstacles?.perceived_barriers || persona.objections}
                tone="amber"
              />
            </div>
          </div>
        </Section>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Section title="Giao tiếp và truyền thông" icon={<MessageCircle size={17} />}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
                Giao tiếp
              </h3>
              <SignalBars signals={communication} />
            </div>
            <div>
              <h3 className="mb-3 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
                Loại nội dung
              </h3>
              <SignalBars signals={profile?.media_digital?.content_types} />
            </div>
            <div>
              <h3 className="mb-3 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
                Nguồn truyền thông
              </h3>
              <SignalBars signals={profile?.media_digital?.media_news_sources} />
            </div>
            <div>
              <h3 className="mb-3 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
                Mạng xã hội
              </h3>
              <SignalBars signals={profile?.media_digital?.social_networks} />
            </div>
          </div>
        </Section>

        <Section title="Thương hiệu và thương mại" icon={<Tags size={17} />}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
                Thương hiệu
              </h3>
              <SignalBars signals={profile?.brand_commerce?.brands} />
            </div>
            <div>
              <h3 className="mb-3 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
                Website đã truy cập
              </h3>
              <SignalBars signals={profile?.media_digital?.websites_visited} />
            </div>
            <div>
              <h3 className="mb-3 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
                Sản phẩm
              </h3>
              <SignalBars
                signals={
                  profile?.brand_commerce?.products ||
                  fallbackSignals(persona.product_fit?.must_haves)
                }
              />
            </div>
            <div>
              <h3 className="mb-3 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
                Website mua sắm
              </h3>
              <SignalBars signals={profile?.brand_commerce?.shopping_websites} />
            </div>
          </div>
        </Section>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Section title="Tín hiệu số" icon={<Globe2 size={17} />}>
          <div className="space-y-5">
            <div>
              <h3 className="mb-2 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
                Hashtag
              </h3>
              <Chips items={profile?.media_digital?.hashtags} />
            </div>
            <div>
              <h3 className="mb-2 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
                Subreddit
              </h3>
              <Chips items={profile?.media_digital?.subreddits} />
            </div>
          </div>
        </Section>

        <Section title="Tương tác website" icon={<Activity size={17} />}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <KeyValueGrid
              items={[
                { label: 'Ngày đầu tiên', value: profile?.website_interaction?.first_interaction_day },
                { label: 'Giờ đầu tiên', value: profile?.website_interaction?.first_interaction_time },
              ]}
            />
            <div>
              <h3 className="mb-3 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
                Nguồn ảnh hưởng chính
              </h3>
              <SignalBars signals={profile?.website_interaction?.influential_resources} />
            </div>
          </div>
        </Section>
      </section>

      <Section title="Sở thích và ưu tiên" icon={<Compass size={17} />}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
              Thể thao
            </h3>
            <SignalBars signals={profile?.preferences?.sports} />
          </div>
          <div>
            <h3 className="mb-3 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
              Giá trị
            </h3>
            <SignalBars
              signals={profile?.preferences?.values || fallbackSignals(persona.psychographics?.core_values)}
            />
          </div>
          <div>
            <h3 className="mb-3 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
              Sở thích
            </h3>
            <SignalBars signals={profile?.preferences?.hobbies} />
          </div>
          <div>
            <h3 className="mb-3 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
              Địa điểm hay ghé
            </h3>
            <SignalBars signals={profile?.preferences?.places_likely_to_visit} />
          </div>
          <div>
            <h3 className="mb-3 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
              Sự kiện
            </h3>
            <SignalBars signals={profile?.preferences?.events_conferences} />
          </div>
          <div>
            <h3 className="mb-3 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
              Công cụ
            </h3>
            <SignalBars signals={profile?.preferences?.tools} />
          </div>
        </div>
      </Section>

      <Section title="Chủ đề cộng hưởng" icon={<Megaphone size={17} />}>
        <SignalBars
          signals={
            profile?.website_interaction?.resonating_topics ||
            fallbackSignals(persona.motivations, 90)
          }
          limit={10}
        />
      </Section>

      <Section title="Insight theo ngành" icon={<BarChart3 size={17} />}>
        <div className="space-y-6">
          <IndustrySignals
            title="Thời trang"
            groups={profile?.industry_specific_insights?.apparel_fashion}
          />
          <IndustrySignals
            title="Đồ thể thao"
            groups={profile?.industry_specific_insights?.sporting_goods}
          />
          <IndustrySignals
            title="Hàng tiêu dùng"
            groups={profile?.industry_specific_insights?.consumer_goods}
          />
        </div>
      </Section>

      <Section title="Xác thực và giả định" icon={<CheckCircle2 size={17} />}>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h3 className="mb-2 text-xs font-black uppercase tracking-wide text-ml-ink-muted">
              Giả định mô phỏng
            </h3>
            <BulletList items={persona.assumptions} />
          </div>
          <div className="rounded-md border border-ml-border bg-ml-surface/40 p-4">
            <div className="text-[10px] font-black uppercase tracking-wide text-ml-ink-muted">
              Xác thực bởi con người
            </div>
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
