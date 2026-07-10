import type { Study } from '../../types';
import type { NewQuestionState } from './studyBuilder.types';

export const studyStatusLabel = (status: Study['status']) =>
  status === 'completed' ? 'HOÀN TẤT' : status === 'running' ? 'ĐANG CHẠY' : 'BẢN NHÁP';

export const isChoiceQuestion = (type: NewQuestionState['type']) =>
  type === 'single_choice' || type === 'multi_choice';
