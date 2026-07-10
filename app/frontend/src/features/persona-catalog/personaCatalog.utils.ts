import type { Persona, WeightedSignal } from '../../types';

export const clampWeight = (weight: number) =>
  Math.max(0, Math.min(100, Math.round(weight)));

export const splitDemographic = (item: string) => {
  const [label, ...rest] = item.split(':');
  return {
    label: rest.length > 0 ? label.trim() : 'Chi tiết',
    value: rest.length > 0 ? rest.join(':').trim() : item,
  };
};

export const getDemographicValue = (persona: Persona, key: string) => {
  const match = persona.demographics.find((item) =>
    item.toLowerCase().startsWith(`${key.toLowerCase()}:`),
  );
  return match?.split(':').slice(1).join(':').trim();
};

export const fallbackSignals = (
  items?: string[],
  start = 88,
): WeightedSignal[] =>
  (items || []).slice(0, 6).map((label, index) => ({
    label,
    weight: Math.max(35, start - index * 9),
  }));
