import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { WeightedSignal } from '../../types';

export type PersonaTab =
  | 'overview'
  | 'research'
  | 'buyer'
  | 'hybrid'
  | 'competitor';

export interface PersonaTabOption {
  id: PersonaTab;
  label: string;
  note?: string;
}

export interface PersonaCreationLearnMore {
  sourceLabel: string;
  sourceItems: string[];
  purpose: string;
  exampleOutput: string;
  features?: string[];
  note?: string;
}

export interface PersonaCreationOption {
  id: Exclude<PersonaTab, 'overview'>;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  badgeClass: string;
  iconClass: string;
  icon: LucideIcon;
  learnMore: PersonaCreationLearnMore;
}

export interface PersonaSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export interface PersonaSignalGroup {
  title: string;
  groups?: Record<string, WeightedSignal[]>;
}
